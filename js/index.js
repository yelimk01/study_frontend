"use strict";
(() => {
  const $ = (id) => document.getElementById(id);
  const config = window.APP_CONFIG || {};
  const pageSize = 100;

  async function places(page) {
    let key = config.TOUR_API_KEY.trim();
    try { key = decodeURIComponent(key); } catch { /* Decoding 키 유지 */ }
    const url = new URL("https://apis.data.go.kr/B551011/KorService2/areaBasedList2");
    url.search = new URLSearchParams({ serviceKey: key, MobileOS: "ETC", MobileApp: "EnjoyTrip", _type: "json", contentTypeId: "12", arrange: "O", numOfRows: String(pageSize), pageNo: String(page) });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error("사진 조회 실패");
      const data = await response.json();
      if (!["0000", "00"].includes(String(data.response?.header?.resultCode))) throw new Error("관광정보 조회 실패");
      const body = data.response.body || {};
      const items = body.items?.item;
      return { items: items ? (Array.isArray(items) ? items : [items]) : [], total: Number(body.totalCount) || 0 };
    } finally { clearTimeout(timer); }
  }

  function photoUrl(item) {
    for (const value of [item.firstimage, item.firstimage2]) {
      try {
        const url = new URL(value);
        if (!["https:", "http:"].includes(url.protocol)) continue;
        if (url.hostname === "tong.visitkorea.or.kr") url.protocol = "https:";
        return url.href;
      } catch { /* 다음 사진 후보 확인 */ }
    }
    return null;
  }

  function loadPhoto(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const timer = setTimeout(() => finish(false), 6000);
      function finish(loaded) {
        clearTimeout(timer);
        image.onload = image.onerror = null;
        if (loaded) resolve(image); else { image.src = ""; reject(new Error("사진 로딩 실패")); }
      }
      image.onload = () => finish(true);
      image.onerror = () => finish(false);
      image.src = url;
    });
  }

  async function randomPlace() {
    try {
      if (!config.TOUR_API_KEY?.trim()) throw new Error("키 없음");
      const first = await places(1);
      const pages = Math.max(1, Math.ceil(first.total / pageSize));
      const page = Math.floor(Math.random() * pages) + 1;
      let items = first.items;
      if (page > 1) {
        try { items = [...(await places(page)).items, ...items]; } catch { /* 첫 페이지 사진으로 대체 */ }
      }
      const candidates = items.map(item => ({ item, url: photoUrl(item) })).filter(candidate => candidate.url);
      // Fisher–Yates 셔플: 페이지를 열 때마다 사진 후보 순서를 변경합니다.
      for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
      }
      for (const { item, url } of candidates.slice(0, 5)) {
        try {
          const image = await loadPhoto(url);
          image.id = "hero-photo";
          image.className = "hero-photo";
          image.alt = `${item.title || "관광지"} 풍경`;
          $("hero-photo").replaceWith(image);
          $("hero-place").classList.add("has-photo");
          $("hero-photo-status").textContent = "오늘 우연히 만난 여행지";
          $("hero-place-title").textContent = item.title || "새로운 여행지";
          $("hero-place-address").textContent = [item.addr1, item.addr2].filter(Boolean).join(" ");
          $("hero-photo-source").hidden = false;
          return;
        } catch { /* 깨진 사진은 건너뛰고 다음 후보 확인 */ }
      }
      throw new Error("사진 없음");
    } catch {
      $("hero-photo-status").textContent = "지금은 여행 사진을 불러올 수 없어요.";
    } finally { $("hero-place").setAttribute("aria-busy", "false"); }
  }
  randomPlace();
})();
