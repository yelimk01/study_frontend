"use strict";

(() => {
  const config = window.APP_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const area = $("area-code");
  const district = $("sigungu-code");
  const type = $("content-type");
  const status = $("search-status");
  const list = $("attraction-list");
  const search = $("search-button");
  const pageSize = 12;
  let currentPage = 1;
  let total = 0;
  let filters = null;
  let busy = false;
  let districtRequest = 0;
  let districtController;
  let map;
  let markers = [];
  let info;
  let results = [];
  const districtCache = new Map();

  async function request(endpoint, params = {}, signal) {
    if (!config.TOUR_API_KEY) throw new Error("관광공사 API 키를 js/config.js에 입력해 주세요.");
    // Encoding 키를 붙여 넣은 경우에도 URLSearchParams가 한 번만 인코딩하도록 합니다.
    let key = config.TOUR_API_KEY.trim();
    try { key = decodeURIComponent(key); } catch { /* Decoding 키는 그대로 사용 */ }
    const url = new URL(`https://apis.data.go.kr/B551011/KorService2/${endpoint}`);
    url.search = new URLSearchParams({ serviceKey: key, MobileOS: "ETC", MobileApp: "EnjoyTrip", _type: "json", numOfRows: "100", pageNo: "1", ...params });
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) abort();
    signal?.addEventListener("abort", abort, { once: true });
    const timeout = setTimeout(abort, 15000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error("관광정보 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
      let data;
      try { data = await response.json(); }
      catch { throw new Error("API 응답을 읽을 수 없습니다. 인증키와 서비스 활용 승인을 확인해 주세요."); }
      const header = data.response?.header;
      if (!header || !["0000", "00"].includes(String(header.resultCode))) {
        throw new Error(`관광공사 API 조회에 실패했습니다 (코드: ${header?.resultCode || "알 수 없음"}). 인증키와 이용 한도를 확인해 주세요.`);
      }
      const body = data.response.body || {};
      const items = body.items?.item;
      return { items: items ? (Array.isArray(items) ? items : [items]) : [], total: Number(body.totalCount) || 0 };
    } catch (error) {
      if (error.name === "AbortError" && !signal?.aborted) throw new Error("응답 시간이 초과되었습니다. 다시 시도해 주세요.");
      throw error;
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", abort);
    }
  }

  function options(select, label, items) {
    select.replaceChildren(new Option(label, ""));
    items.forEach((item) => select.add(new Option(item.name, item.code)));
  }

  async function loadAreas() {
    search.disabled = true;
    status.textContent = "지역 목록을 불러오는 중입니다.";
    try {
      const data = await request("areaCode2");
      if (!data.items.length) throw new Error("지역 목록이 없습니다. 다시 시도해 주세요.");
      options(area, "지역을 선택하세요", data.items);
      area.disabled = false;
      search.disabled = false;
      $("retry-areas").hidden = true;
      status.textContent = "지역과 관광 유형을 선택한 뒤 조회해 주세요.";
    } catch (error) {
      status.textContent = error.message;
      $("retry-areas").hidden = false;
    }
  }

  async function loadDistricts() {
    const version = ++districtRequest;
    districtController?.abort();
    options(district, "시·군·구 전체", []);
    district.disabled = true;
    $("filter-status").textContent = "";
    if (!area.value) return;
    const code = area.value;
    districtController = new AbortController();
    $("filter-status").textContent = "시·군·구 목록을 불러오는 중입니다.";
    try {
      let items = districtCache.get(code);
      if (!items) {
        items = (await request("areaCode2", { areaCode: code }, districtController.signal)).items;
        districtCache.set(code, items);
      }
      if (version !== districtRequest) return;
      options(district, "시·군·구 전체", items);
      district.disabled = false;
      $("filter-status").textContent = "";
    } catch (error) {
      if (version !== districtRequest) return;
      $("filter-status").textContent = "시·군·구를 불러오지 못했습니다. 지역 전체 조회는 가능합니다. 지역을 다시 선택하면 재시도합니다.";
    }
  }

  function coordinate(item) {
    const lat = Number(item.mapy), lng = Number(item.mapx);
    return Number.isFinite(lat) && Number.isFinite(lng) && lat >= 33 && lat <= 39 && lng >= 124 && lng <= 132
      ? { lat, lng } : null;
  }

  function imageUrl(value) {
    try {
      const url = new URL(value);
      if (!["https:", "http:"].includes(url.protocol)) return null;
      if (url.hostname === "tong.visitkorea.or.kr") url.protocol = "https:";
      return url.href;
    } catch { return null; }
  }

  function focusItem(index) {
    if (!map || !markers[index]) return;
    const marker = markers[index];
    map.panTo(marker.getPosition());
    const label = document.createElement("div");
    label.className = "tour-map-label";
    label.textContent = results[index].title;
    info.setContent(label);
    info.open(map, marker);
    list.querySelectorAll(".tour-card").forEach((card, i) => card.classList.toggle("tour-card-selected", index === i));
  }

  function renderMarkers() {
    if (!map) return;
    info.close();
    markers.forEach((marker) => marker?.setMap(null));
    const bounds = new kakao.maps.LatLngBounds();
    let count = 0;
    markers = results.map((item, index) => {
      const point = coordinate(item);
      if (!point) return null;
      const position = new kakao.maps.LatLng(point.lat, point.lng);
      const marker = new kakao.maps.Marker({ map, position, title: item.title });
      kakao.maps.event.addListener(marker, "click", () => focusItem(index));
      bounds.extend(position);
      count++;
      return marker;
    });
    if (count === 1) { map.setCenter(markers.find(Boolean).getPosition()); map.setLevel(4); }
    else if (count > 1) map.setBounds(bounds);
    $("map-status").textContent = results.length ? `현재 페이지 ${results.length}곳 중 ${count}곳을 지도에 표시했습니다.` : "조회 결과의 위치가 지도에 표시됩니다.";
    list.querySelectorAll(".tour-map-button").forEach((button, index) => { button.disabled = !markers[index]; });
  }

  function renderCards() {
    list.replaceChildren();
    results.forEach((item, index) => {
      const column = document.createElement("div");
      column.className = "col-12 col-md-6";
      const card = document.createElement("article");
      card.className = "card h-100 tour-card";
      const photo = imageUrl(item.firstimage2 || item.firstimage);
      const placeholder = document.createElement("div");
      placeholder.className = "tour-image-placeholder";
      placeholder.textContent = "사진 준비 중";
      if (photo) {
        const image = document.createElement("img");
        image.className = "card-img-top tour-image";
        image.src = photo;
        image.alt = item.title || "관광지 사진";
        image.loading = "lazy";
        image.addEventListener("error", () => image.replaceWith(placeholder), { once: true });
        card.append(image);
      } else card.append(placeholder);
      const body = document.createElement("div");
      body.className = "card-body d-flex flex-column";
      const title = document.createElement("h3");
      title.className = "h6";
      title.textContent = item.title || "이름 없음";
      const address = document.createElement("p");
      address.className = "small text-secondary";
      address.textContent = [item.addr1, item.addr2].filter(Boolean).join(" ") || "주소 정보 없음";
      const category = document.createElement("p");
      category.className = "small text-primary";
      category.textContent = Array.from(type.options).find((option) => option.value === String(item.contenttypeid))?.textContent || "관광정보";
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-outline-primary btn-sm mt-auto tour-map-button";
      button.textContent = coordinate(item) ? "지도에서 보기" : "위치 정보 없음";
      button.disabled = !map || !coordinate(item);
      button.addEventListener("click", () => { focusItem(index); $("map").scrollIntoView({ behavior: "smooth", block: "center" }); });
      body.append(title, category, address, button);
      card.append(body);
      column.append(card);
      list.append(column);
    });
    renderMarkers();
  }

  function pagination() {
    const pages = Math.ceil(total / pageSize);
    $("pagination").hidden = total === 0;
    $("page-info").textContent = `${currentPage} / ${pages} 페이지`;
    $("previous-page").disabled = busy || currentPage <= 1;
    $("next-page").disabled = busy || currentPage >= pages;
  }

  async function searchPage(page) {
    if (busy || !filters) return;
    busy = true;
    search.disabled = true;
    list.setAttribute("aria-busy", "true");
    pagination();
    status.textContent = "관광정보를 조회하는 중입니다.";
    try {
      const data = await request("areaBasedList2", { ...filters, numOfRows: String(pageSize), pageNo: String(page), arrange: "A" });
      currentPage = page;
      total = data.total;
      results = data.items;
      renderCards();
      status.textContent = total ? `총 ${total.toLocaleString()}곳 중 ${(page - 1) * pageSize + 1}–${(page - 1) * pageSize + results.length}번째 결과입니다.` : "선택한 조건의 관광정보가 없습니다.";
    } catch (error) {
      results = [];
      total = 0;
      renderCards();
      status.textContent = error.message;
    } finally {
      busy = false;
      search.disabled = false;
      list.setAttribute("aria-busy", "false");
      pagination();
    }
  }

  async function initMap() {
    try {
      if (!config.KAKAO_JS_KEY) throw new Error("카카오 JavaScript 키를 js/config.js에 입력해 주세요.");
      await new Promise((resolve, reject) => {
        const sdk = document.createElement("script");
        sdk.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(config.KAKAO_JS_KEY.trim())}&autoload=false`;
        const timeout = setTimeout(() => reject(new Error("지도 로딩 시간이 초과되었습니다. 키와 실행 주소 등록을 확인한 뒤 새로고침해 주세요.")), 15000);
        sdk.onload = () => {
          if (!window.kakao?.maps) { clearTimeout(timeout); reject(new Error("지도 SDK를 사용할 수 없습니다. 키와 실행 주소 등록을 확인해 주세요.")); return; }
          kakao.maps.load(() => { clearTimeout(timeout); resolve(); });
        };
        sdk.onerror = () => { clearTimeout(timeout); reject(new Error("지도를 불러오지 못했습니다. 카카오맵 사용 설정이 ON인지, JavaScript 키와 실행 주소가 등록되어 있는지 확인해 주세요.")); };
        document.head.append(sdk);
      });
      $("map").textContent = "";
      map = new kakao.maps.Map($("map"), { center: new kakao.maps.LatLng(37.5665, 126.978), level: 7 });
      info = new kakao.maps.InfoWindow({ removable: true });
      renderMarkers();
      let resizeTimer;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { const center = map.getCenter(); map.relayout(); map.setCenter(center); }, 150);
      });
    } catch (error) {
      $("map").textContent = "지도를 표시할 수 없습니다.";
      $("map-status").textContent = error.message;
    }
  }

  $("search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (busy) return;
    if (!area.value) { status.textContent = "먼저 지역을 선택해 주세요."; area.focus(); return; }
    filters = { areaCode: area.value };
    if (!district.disabled && district.value) filters.sigunguCode = district.value;
    if (type.value) filters.contentTypeId = type.value;
    searchPage(1);
  });
  area.addEventListener("change", loadDistricts);
  $("retry-areas").addEventListener("click", loadAreas);
  $("previous-page").addEventListener("click", () => searchPage(currentPage - 1));
  $("next-page").addEventListener("click", () => searchPage(currentPage + 1));
  loadAreas();
  initMap();
})();
