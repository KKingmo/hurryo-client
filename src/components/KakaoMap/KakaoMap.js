/* global kakao */
import "./KakaoMap.css";
import React, { useEffect, useState, useRef, useCallback } from "react";

export default function KakaoMap(props) {
  const { tltfilter, prkfilter } = props;
  const [kakaoMap, setKakaoMap] = useState(null);
  const container = useRef();
  const [, setMarkers] = useState([]);

  const markerPositions1 = tltfilter.map((tltlot) => [
    +tltlot["위도"],
    +tltlot["경도"],
  ]);

  const markerPositions1data = tltfilter.map((tltlot) => [
    tltlot["화장실명"],
    tltlot["소재지도로명주소"],
    tltlot["개방시간"],
    tltlot["구분"],
    tltlot["전화번호"],
    tltlot["남녀공용화장실여부"],
    tltlot["남성용-어린이용대변기수"],
    tltlot["여성용-어린이용대변기수"],
    tltlot["남성용-장애인용대변기수"],
    tltlot["여성용-장애인용대변기수"],
  ]);

  const markerPositions2 = prkfilter.map((prklot) => [
    +prklot["위도"],
    +prklot["경도"],
  ]);

  const markerPositions2data = prkfilter.map((prklot) => [
    prklot["주차장명"],
    prklot["소재지도로명주소"],
    prklot["요금정보"],
    prklot["운영요일"],
    prklot["전화번호"],
    prklot["1일주차권요금"],
    prklot["1일주차권요금적용시간"],
    prklot["주차기본시간"],
    prklot["주차기본요금"],
    prklot["추가단위시간"],
    prklot["추가단위요금"],
  ]);

  // 접속 위치를 가져오는 함수
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      if (kakaoMap !== null) {
        navigator.geolocation.getCurrentPosition(function (position) {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          // 마커카 표시될 위치를 geolocation으로 얻어온 좌표로 생성
          const locPosition = new kakao.maps.LatLng(lat, lon);
          // 지도에 접속위치 마커 생성
          const displayMarker = (locPosition) => {
            const imageSrc = "images/my_location_marker.png";
            // 현재위치 마커 이미지
            const imageSize = new kakao.maps.Size(30, 30);
            // 현재위치 마커 이미지 생성
            const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
            // 마커 생성
            var marker = new kakao.maps.Marker({
              map: kakaoMap,
              position: locPosition,
              image: markerImage, // 현재위치 마커
            });
            // 현재위치 마커 생성
            marker.setMap(kakaoMap);
            // 지도 중심좌표를 접속위치로 변경
            kakaoMap.setCenter(locPosition);
          };
          displayMarker(locPosition);
        });
      }
    } else {
      alert("GPS 정보를 가져올 수 없습니다.");
    }
  }, [kakaoMap]);
  // 0610 update
  // 카카오 지도 생성
  useEffect(() => {
    const script = document.createElement("script");
    script.src = process.env.REACT_APP_KAKAO_MAP;
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        const center = new kakao.maps.LatLng(37.214190917, 126.978771734);
        const options = {
          center,
          level: 3,
        };
        // 지도 생성
        const map = new kakao.maps.Map(container.current, options);
        // 지도 오른쪽에 타입, 줌 컨트롤러 표시
        const mapTypeControl = new kakao.maps.MapTypeControl();
        const zoomControl = new kakao.maps.ZoomControl();
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
        // 렉 방지를 위한 지도 축소 제한
        map.setMaxLevel(6);
        setKakaoMap(map);
      });
    };
  }, [container]);

  // 지도 조작, 설정 조작시 마커 업데이트
  useEffect(() => {
    if (kakaoMap === null) {
      return;
    }
    // 화장실, 주차장 마커 이미지
    const tltSrc = "images/tlt_marker.png";
    const prkSrc = "images/prk_marker.png";
    // 현재위치 마커 이미지
    const plceSize = new kakao.maps.Size(34, 44);
    // 현재위치 마커 이미지 생성
    const markerTlt = new kakao.maps.MarkerImage(tltSrc, plceSize);
    const markerPrk = new kakao.maps.MarkerImage(prkSrc, plceSize);
    let timer;
    const updateMarker = () => {
      if (timer) {
        clearTimeout(timer);
      }
      const info = [];
      timer = setTimeout(function () {
        // 열려있던 인포윈도우 닫기
        const closeInfoWindow = () => {
          info.forEach((infowindow) => {
            infowindow.close();
          });
        };
        const bounds = kakaoMap.getBounds();
        const searchMarkers1 = markerPositions1.filter((pos) =>
          bounds.contain(new kakao.maps.LatLng(...pos))
        );

        const searchMarkers2 = markerPositions2.filter((pos) =>
          bounds.contain(new kakao.maps.LatLng(...pos))
        );

        const newpos1 = searchMarkers1.map((pos) => {
          const index1 = markerPositions1.indexOf(pos);
          const data1 = markerPositions1data[index1];
          const marker1 = new kakao.maps.Marker({
            map: kakaoMap,
            position: new kakao.maps.LatLng(...pos),
            image: markerTlt,
          });
          const content1 = `
          <div class="info-area">
          <span class="info-title">화장실명 : ${data1[0]}</span>
          <span class="info-title">소재지도로명주소 : ${data1[1]}</span>
          <span class="info-title">개방시간 : ${data1[2]}</span>
          <span class="info-title">구분 : ${data1[3]}</span>
          <span class="info-title">전화번호 : ${data1[4]}</span>
          <span class="info-title">남녀공용화장실여부 : ${data1[5]}</span>
          <span class="info-title">남성용-어린이용대변기수 : ${data1[6]}</span>
          <span class="info-title">여성용-어린이용대변기수 : ${data1[7]}</span>
          <span class="info-title">남성용-장애인용대변기수 : ${data1[8]}</span>
          <span class="info-title">여성용-장애인용대변기수 : ${data1[9]}</span>
          </div>
          `;
          const infowindow1 = new kakao.maps.InfoWindow({
            content: content1,
            position: new kakao.maps.LatLng(...pos),
            zIndex: 9,
            removable: true,
          });
          info.push(infowindow1);

          kakao.maps.event.addListener(marker1, "click", function () {
            closeInfoWindow();
            infowindow1.open(kakaoMap, marker1);
          });
          kakao.maps.event.addListener(kakaoMap, "click", function () {
            closeInfoWindow();
          });
          return marker1;
        });

        const newpos2 = searchMarkers2.map((pos) => {
          const index2 = markerPositions2.indexOf(pos);
          const data2 = markerPositions2data[index2];
          const marker2 = new kakao.maps.Marker({
            map: kakaoMap,
            position: new kakao.maps.LatLng(...pos),
            image: markerPrk,
          });
          const content2 = `
          <div class="info-area">
          <span class="info-title">주차장명 : ${data2[0]}</span>
          <span class="info-title">소재지도로명주소 : ${data2[1]}</span>
          <span class="info-title">요금정보 : ${data2[2]}</span>
          <span class="info-title">운영요일 : ${data2[3]}</span>
          <span class="info-title">전화번호 : ${data2[4]}</span>
          <span class="info-title">1일주차권요금 : ${data2[5]}</span>
          <span class="info-title">1일주차권요금적용시간 : ${data2[6]}</span>
          <span class="info-title">주차기본시간 : ${data2[7]}</span>
          <span class="info-title">주차기본요금 : ${data2[8]}</span>
          <span class="info-title">추가단위시간 : ${data2[9]}</span>
          <span class="info-title">추가단위요금 : ${data2[10]}</span>
          </div>
          `;
          const infowindow2 = new kakao.maps.InfoWindow({
            content: content2,
            position: new kakao.maps.LatLng(...pos),
            zIndex: 9,
            removable: true,
          });
          info.push(infowindow2);
          kakao.maps.event.addListener(marker2, "click", function () {
            closeInfoWindow();
            infowindow2.open(kakaoMap, marker2);
          });
          kakao.maps.event.addListener(kakaoMap, "click", function () {
            closeInfoWindow();
          });
          return marker2;
        });
        const newpos = [...newpos1, ...newpos2];
        setMarkers((markers) => {
          // 이전 마커 삭제
          markers.forEach((marker) => marker.setMap(null));
          return newpos;
        });
        console.log(info);
      }, 1000);
    };
    updateMarker();
    kakao.maps.event.addListener(kakaoMap, "idle", updateMarker);
  }, [kakaoMap, tltfilter, prkfilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // 사이트 접속시 현재위치 활성화
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return (
    <>
      <div id="container" ref={container}>
        <div id="getgeobtn" onClick={getCurrentLocation}>
          <img src="images/get_geo_icon.png" alt="현재위치" />
        </div>
        <div id="searchPlaces">
          <div className="place-info">
            <img src="images/my_location_marker.png" alt="현재위치" />
            <span>현재위치</span>
          </div>
          <div className="place-info">
            <img src="images/tlt_marker.png" alt="화장실" />
            <span>화장실</span>
          </div>
          <div className="place-info">
            <img src="images/prk_marker.png" alt="주차장" />
            <span>주차장</span>
          </div>
        </div>
      </div>
    </>
  );
}
