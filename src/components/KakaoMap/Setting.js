/* eslint-disable */
import React, { useState, useEffect } from "react";
import Map from "./Map";

export default function Setting() {
  const [checkboxes1, setCheckboxes1] = useState([]);
  const [checkboxes2, setCheckboxes2] = useState([]);

  const handleFilter1 = async (item) => {
    const { checked, id } = item.target;
    if (checked) {
      // add
      setCheckboxes1([...checkboxes1, id]);
    } else {
      // remove
      checkboxes1.splice(checkboxes1.indexOf(id), 1);
      setCheckboxes1([...checkboxes1]);
    }
  };

  const handleFilter2 = async (item) => {
    const { checked, id } = item.target;
    if (checked) {
      // add
      setCheckboxes2([...checkboxes2, id]);
    } else {
      // remove
      checkboxes2.splice(checkboxes2.indexOf(id), 1);
      setCheckboxes2([...checkboxes2]);
    }
  };

  useEffect(() => {
    const allInput = document.querySelectorAll("INPUT");

    for (let i = 0; i < allInput.length; i++) {
      document.querySelectorAll("INPUT")[i].checked = false;
    }
  }, []);

  return (
    <>
      <Map checkboxes1={checkboxes1} checkboxes2={checkboxes2} />
      <div id="setting">
        <div className="setting-wrap">
          <h1>🚽 화장실 설정</h1>
          <div className="setting-area">
            <h2>남여공용여부</h2>
            <div className="setting-area">
              <label className="checklist">
                분리
                <input
                  type="checkbox"
                  id="분리"
                  onChange={(e) => handleFilter1(e)}
                />
                <span className="checkmark" />
              </label>
            </div>
          </div>
          <div className="setting-area">
            <h2>편의시설여부</h2>
            <div className="setting-area">
              <label className="checklist">
                남성용-어린이용대변기
                <input
                  type="checkbox"
                  id="남성용-어린이용대변기"
                  onChange={(e) => handleFilter1(e)}
                />
                <span className="checkmark" />
              </label>
              <label className="checklist">
                여성용-어린이용대변기
                <input
                  type="checkbox"
                  id="여성용-어린이용대변기"
                  onChange={(e) => handleFilter1(e)}
                />
                <span className="checkmark" />
              </label>
              <label className="checklist">
                남성용-장애인용대변기
                <input
                  type="checkbox"
                  id="남성용-장애인용대변기"
                  onChange={(e) => handleFilter1(e)}
                />
                <span className="checkmark" />
              </label>
              <label className="checklist">
                여성용-장애인용대변기
                <input
                  type="checkbox"
                  id="여성용-장애인용대변기"
                  onChange={(e) => handleFilter1(e)}
                />
                <span className="checkmark" />
              </label>
            </div>
          </div>
        </div>
        <div className="setting-wrap">
          <h1>🚗 주차장 설정</h1>
          <div className="setting-area">
            <h2>이용요금</h2>
            <div className="setting-area">
              <label className="checklist">
                무료
                <input
                  type="checkbox"
                  id="무료"
                  onChange={(e) => handleFilter2(e)}
                />
                <span className="checkmark" />
              </label>
            </div>
          </div>
          <div className="setting-area">
            <h2>운영요일</h2>
            <div className="setting-area">
              <label className="checklist">
                평일
                <input
                  type="checkbox"
                  id="평일"
                  onChange={(e) => handleFilter2(e)}
                />
                <span className="checkmark" />
              </label>
              <label className="checklist">
                토요일
                <input
                  type="checkbox"
                  id="토요일"
                  onChange={(e) => handleFilter2(e)}
                />
                <span className="checkmark" />
              </label>
              <label className="checklist">
                공휴일
                <input
                  type="checkbox"
                  id="공휴일"
                  onChange={(e) => handleFilter2(e)}
                />
                <span className="checkmark" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
