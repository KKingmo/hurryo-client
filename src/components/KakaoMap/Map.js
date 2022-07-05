/* eslint-disable */
import React, { useState, useEffect } from "react";
import KakaoMap from "./KakaoMap";
import { Spin, Alert } from "antd";
import axios from "axios";
import { API_URL } from "../../config/constants";

export default function App(props) {
  const { checkboxes1, checkboxes2 } = props;
  const [tltplce, setTltplce] = useState([]);
  const [prkplce, setPrkplce] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tltfilter, setTltfilter] = useState([]);
  const [prkfilter, setPrkfilter] = useState([]);

  // 다차원 배열의 중복 추출
  const getArraysIntersection = (list1, list2, ...otherLists) => {
    const result = [];
    if (list1.length > 0 && list2.length > 0) {
      for (let i = 0; i < list1.length; i++) {
        let item1 = list1[i];
        let found = false;
        for (var j = 0; j < list2.length && !found; j++) {
          found = item1 === list2[j];
        }
        if (found === true) {
          result.push(item1);
        }
      }
    } else {
      list1.map((item) => {
        result.push(item);
      });
      list2.map((item) => {
        result.push(item);
      });
    }
    if (otherLists.length) {
      return getArraysIntersection(result, otherLists.shift(), ...otherLists);
    } else {
      return result;
    }
  };

  // 화장실, 주차장 데이터 multi request
  useEffect(() => {
    axios
      .all([
        axios.get(`${API_URL}/api/toilets`),
        axios.get(`${API_URL}/api/parklots`),
      ])
      .then(
        axios.spread((res1, res2) => {
          setTltplce(res1.data.records.filter((tlt) => +tlt["위도"] > 33));
          setPrkplce(res2.data.records.filter((prk) => +prk["위도"] > 33));
          setLoading(false);
        })
      )
      .catch((error) => console.error(error));
  }, []);

  // 필터링 정보가 없으면 request 데이터로 보여주기
  useEffect(() => {
    if (!loading) {
      if (tltfilter.length === 0) {
        setTltfilter(tltplce);
      }
    }
  }, [loading, tltfilter]);

  // 필터링 정보가 없으면 request 데이터로 보여주기
  useEffect(() => {
    if (!loading) {
      if (prkfilter.length === 0) {
        setPrkfilter(prkplce);
      }
    }
  }, [loading, prkfilter]);

  // 화장실 설정 실시간 필터링
  useEffect(() => {
    const a1 = tltplce.filter((tlt) => {
      if (checkboxes1.includes("분리")) {
        return tlt["남녀공용화장실여부"].toLowerCase() === "n";
      }
    });
    const a2 = tltplce.filter((tlt) => {
      if (checkboxes1.includes("남성용-어린이용대변기")) {
        return +tlt["남성용-어린이용대변기수"] > 0;
      }
    });
    const a3 = tltplce.filter((tlt) => {
      if (checkboxes1.includes("여성용-어린이용대변기")) {
        return +tlt["여성용-어린이용대변기수"] > 0;
      }
    });
    const a4 = tltplce.filter((tlt) => {
      if (checkboxes1.includes("남성용-장애인용대변기")) {
        return +tlt["남성용-장애인용대변기수"] > 0;
      }
    });
    const a5 = tltplce.filter((tlt) => {
      if (checkboxes1.includes("여성용-장애인용대변기")) {
        return +tlt["여성용-장애인용대변기수"] > 0;
      }
    });
    const aa = () => {
      if (checkboxes1.length < 2) {
        return a1.concat(a2, a3, a4, a5);
      } else {
        return getArraysIntersection(a1, a2, a3, a4, a5);
      }
    };
    setTltfilter(aa());
  }, [checkboxes1]);

  // 주차장 설정 실시간 필터링
  useEffect(() => {
    const b1 = prkplce.filter((prk) => {
      if (checkboxes2.includes("무료")) {
        return prk["요금정보"] === "무료";
      }
    });
    const b2 = prkplce.filter((prk) => {
      if (checkboxes2.includes("평일")) {
        return prk["운영요일"].includes("평일");
      }
    });
    const b3 = prkplce.filter((prk) => {
      if (checkboxes2.includes("토요일")) {
        return prk["운영요일"].includes("토요일");
      }
    });
    const b4 = prkplce.filter((prk) => {
      if (checkboxes2.includes("공휴일")) {
        return prk["운영요일"].includes("공휴일");
      }
    });
    const bb = () => {
      if (checkboxes2.length < 2) {
        return b1.concat(b2, b3, b4);
      } else {
        return getArraysIntersection(b1, b2, b3, b4);
      }
    };
    setPrkfilter(bb());
  }, [checkboxes2]);

  console.log(tltfilter, prkfilter);

  // 로딩 메세지
  if (loading) {
    return (
      <div>
        <Spin
          tip="😄 데이터 처리중 입니다. 잠시만 기다려주세요. 😄"
          size="large"
        >
          <Alert
            message="😅 잠시만 기다려주세요"
            description="화장실, 주차장 정보를 불러오는 중입니다."
            type="info"
          />
        </Spin>
      </div>
    );
  }

  return (
    <div className="map-area">
      <div id="wrap">
        <KakaoMap tltfilter={tltfilter} prkfilter={prkfilter} />
      </div>
    </div>
  );
}
