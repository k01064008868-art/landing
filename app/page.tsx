"use client";

import { FormEvent, useState } from "react";

const PHONE_DISPLAY = "010-6689-2348";
const PHONE_LINK = "tel:01066892348";

const premiums = [
  { no: "01", label: "MEDICAL", title: "가까이에서 누리는 메디컬 비전", text: "아주대병원과 의료 R&D 복합타운 계획으로 완성되는 새로운 생활권" },
  { no: "02", label: "EDUCATION", title: "아이의 내일을 키우는 교육환경", text: "초·중학교와 KAIST 평택캠퍼스 계획을 가까이 둔 교육 중심 입지" },
  { no: "03", label: "GREEN", title: "문 앞에서 시작되는 공원 생활", text: "단지 앞 근린공원과 풍부한 단지 조경이 이어지는 쾌적한 일상" },
  { no: "04", label: "LIFE & MOVE", title: "생활과 이동이 편리한 중심", text: "중심상업지역과 광역 교통망을 함께 누리는 브레인시티 6BL" },
];

const units = {
  "84A": {
    image: "/unit-84a.jpg",
    count: "563세대",
    area: "전용 84.9911㎡",
    title: "가족의 일상과 수납을 넉넉하게",
    points: ["거실-주방 맞통풍 구조", "알파룸으로 높인 공간 활용도", "드레스룸과 팬트리 수납", "유상옵션 선택 시 11자 주방"],
  },
  "84B": {
    image: "/unit-84b.jpg",
    count: "167세대",
    area: "전용 84.9817㎡",
    title: "프라이버시와 효율적인 동선",
    points: ["효율적인 ㄱ자형 주방", "거실·침실 남향 위주 배치", "안방 독립형 구조", "드레스룸과 팬트리 수납"],
  },
  "101㎡": {
    image: "/unit-101.jpg",
    count: "333세대",
    area: "전용 101.9898㎡",
    title: "더 큰 여유와 활용도를 설계",
    points: ["거실-주방 맞통풍 구조", "알파룸으로 넓어진 생활", "대형 드레스룸과 팬트리", "유상옵션 선택 시 T자 주방"],
  },
};

type UnitKey = keyof typeof units;

export default function Home() {
  const [unit, setUnit] = useState<UnitKey>("84A");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSubmitting(true);
    setMessage("");
    const form = new FormData(formElement);
    const payload = {
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || "").replace(/\D/g, ""),
      interestType: String(form.get("interestType") || "미정"),
      preferredTime: String(form.get("preferredTime") || ""),
      privacyConsent: form.get("privacyConsent") === "on",
      marketingConsent: form.get("marketingConsent") === "on",
      utmSource: new URLSearchParams(location.search).get("utm_source") || "",
      utmMedium: new URLSearchParams(location.search).get("utm_medium") || "",
      utmCampaign: new URLSearchParams(location.search).get("utm_campaign") || "",
      referrer: document.referrer,
      pageUrl: location.href,
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        throw new Error(result.message || "Lead submission failed");
      }
      setMessage(`상담 신청이 완료되었습니다. 접수번호는 ${result.receiptId}입니다.`);
      formElement.reset();
    } catch {
      setMessage(`접수가 완료되지 않았습니다. 다시 시도하거나 ${PHONE_DISPLAY}로 문의해 주세요.`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="메디스파크 홈">
          <span>브레인시티</span>
          <strong>메디스파크</strong>
        </a>
        <nav className={mobileMenu ? "nav open" : "nav"} aria-label="주 메뉴">
          {[
            ["프리미엄", "premium"],
            ["입지환경", "location"],
            ["단지안내", "complex"],
            ["세대안내", "units"],
            ["상담신청", "contact"],
          ].map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMobileMenu(false)}>{label}</a>
          ))}
        </nav>
        <a className="header-call" href={PHONE_LINK}><small>분양 상담</small>{PHONE_DISPLAY}</a>
        <button className="menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="메뉴 열기" aria-expanded={mobileMenu}>
          <span /><span /><span />
        </button>
      </header>

      <section className="hero" id="top">
        <img src="/hero.jpg" alt="브레인시티 메디스파크 로제비앙 모아엘가 단지 조감도" />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow">PYEONGTAEK BRAIN CITY 6BL</p>
          <h1>건강과 배움,<br /><em>공원까지 가까운</em><br />새로운 중심</h1>
          <p className="hero-name">브레인시티 메디스파크<br className="mobile-only" /> 로제비앙 모아엘가</p>
          <div className="hero-facts">
            <span><b>1,215</b>세대</span>
            <span><b>35</b>층</span>
            <span><b>84·101</b>㎡ 중심</span>
          </div>
          <div className="hero-actions">
            <a className="button primary" href="#contact">방문 상담 신청 <span>→</span></a>
            <a className="button glass" href={PHONE_LINK}>분양 상담 {PHONE_DISPLAY}</a>
          </div>
        </div>
        <p className="hero-note">※ 본 이미지는 소비자의 이해를 돕기 위한 이미지이며 실제와 다를 수 있습니다.</p>
      </section>

      <section className="number-bar" aria-label="사업 핵심 정보">
        {[["1,215", "총 세대수"], ["10", "개 동"], ["35", "최고 층수"], ["1.41", "세대당 주차"], ["84·101", "㎡ 중심 타입"]].map(([n, l]) => (
          <div key={l}><strong>{n}</strong><span>{l}</span></div>
        ))}
      </section>

      <section className="section premium-section" id="premium">
        <div className="section-heading">
          <p className="eyebrow teal">MEDISPARK PREMIUM</p>
          <h2>일상의 중요한 것이<br />가까워지는 자리</h2>
          <p>가족의 건강과 배움, 휴식과 편리함을 한 생활권 안에 담았습니다.</p>
        </div>
        <div className="premium-grid">
          {premiums.map((item) => (
            <article key={item.no}>
              <span className="premium-no">{item.no}</span>
              <p>{item.label}</p>
              <h3>{item.title}</h3>
              <div className="gold-line" />
              <span>{item.text}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section medical-section">
        <div className="split-image"><img src="/medical.jpg" alt="아주대병원과 의료 R&D 복합타운 계획 이미지" /></div>
        <div className="split-copy">
          <p className="eyebrow teal">MEDICAL VISION</p>
          <h2>의료와 연구가 함께 성장하는<br />메디컬 생활권</h2>
          <p className="lead">아주대병원과 의료 R&D가 어우러진 헬스케어 복합타운 계획으로 브레인시티의 새로운 생활 기준을 기대합니다.</p>
          <div className="mini-stats">
            <div><strong>500</strong><span>병상 규모 계획</span></div>
            <div><strong>2030</strong><span>개원 예정*</span></div>
            <div><strong>R&D</strong><span>의료 연구시설 계획</span></div>
          </div>
          <p className="fine">* 내부 사업자료 기준 예정 사항으로 관계 기관의 사업 추진에 따라 변경될 수 있습니다.</p>
        </div>
      </section>

      <section className="section location-section" id="location">
        <div className="section-heading centered">
          <p className="eyebrow teal">EVERYTHING NEARBY</p>
          <h2>학교·병원·공원·생활을 가까이</h2>
          <p>통학과 진료, 산책과 쇼핑까지 가족의 하루를 이루는 목적지를 한 생활권 안에 담았습니다.</p>
        </div>
        <div className="location-layout">
          <img src="/location.jpg" alt="메디스파크 주변 학교 병원 상업지역 공원 위치도" />
          <div className="location-cards">
            {[
              ["01", "EDUCATION", "초·중학교", "단지 인근 교육시설 계획"],
              ["02", "MEDICAL", "아주대병원", "의료복합타운 조성 계획"],
              ["03", "LIFESTYLE", "중심상업지역", "일상을 채우는 생활 인프라"],
              ["04", "GREEN", "근린공원", "단지 앞에서 시작되는 산책"],
            ].map(([no, en, title, text]) => <div key={no}><b>{no}</b><span>{en}</span><h3>{title}</h3><p>{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="transport-section">
        <div className="section-heading centered light">
          <p className="eyebrow">WIDE TRANSPORT NETWORK</p>
          <h2>평택을 넘어 수도권으로 이어지는 길</h2>
          <p>풍부한 도로망과 철도 교통 계획으로 더 넓어지는 생활 반경</p>
        </div>
        <div className="transport-grid">
          <figure><img src="/roads.jpg" alt="메디스파크 주변 광역 도로망 안내" /><figcaption><span>ROAD</span>광역 도로망</figcaption></figure>
          <figure><img src="/rail.jpg" alt="메디스파크 주변 철도 교통망 계획 안내" /><figcaption><span>METRO</span>철도 교통망 계획</figcaption></figure>
        </div>
        <p className="section-note">※ 교통계획은 관계 기관의 사업 추진 및 인허가 과정에서 변경될 수 있습니다.</p>
      </section>

      <section className="section complex-section" id="complex">
        <div className="section-heading">
          <p className="eyebrow teal">COMPLEX DESIGN</p>
          <h2>빛과 바람, 녹지를 고려한<br />1,215세대 대단지</h2>
        </div>
        <div className="complex-layout">
          <img src="/siteplan.jpg" alt="메디스파크 단지 배치도" />
          <div className="complex-points">
            {[
              ["SOUTH", "남향 위주의 단지 배치", "채광과 일조를 고려한 쾌적한 주거환경"],
              ["OPEN", "여유로운 동간 거리", "시야 간섭을 줄이고 개방감을 높인 설계"],
              ["GREEN", "공원과 이어지는 단지", "단지 조경과 앞마당 같은 근린공원"],
              ["COMMUNITY", "다채로운 커뮤니티", "운동·가족·학습을 아우르는 입주민 공간"],
            ].map(([en, title, text]) => <div key={en}><span>{en}</span><h3>{title}</h3><p>{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="units-section" id="units">
        <div className="section-heading centered">
          <p className="eyebrow teal">UNIT PLAN</p>
          <h2>공간은 넉넉하게, 생활은 더 편리하게</h2>
          <p>가족의 라이프스타일에 맞춘 실용적인 공간 구성을 확인하세요.</p>
        </div>
        <div className="unit-tabs" role="tablist">
          {(Object.keys(units) as UnitKey[]).map((key) => (
            <button key={key} role="tab" aria-selected={unit === key} onClick={() => setUnit(key)}>{key}<small>{units[key].count}</small></button>
          ))}
        </div>
        <div className="unit-panel">
          <div className="unit-image"><img src={units[unit].image} alt={`${unit} 타입 평면도`} /></div>
          <div className="unit-copy">
            <p className="eyebrow teal">{unit} TYPE</p>
            <h2>{units[unit].title}</h2>
            <div className="unit-meta"><span>{units[unit].count}</span><span>{units[unit].area}</span></div>
            <ul>{units[unit].points.map((point) => <li key={point}>{point}</li>)}</ul>
            <a className="text-link" href="#contact">{unit} 타입 상담 신청 →</a>
          </div>
        </div>
        <p className="section-note dark">※ 평면도 및 유상옵션은 소비자의 이해를 돕기 위한 것으로 실제 시공 내용은 계약 시 제공되는 자료를 확인하시기 바랍니다.</p>
      </section>

      <section className="overview-section">
        <div className="overview-title"><p className="eyebrow">PROJECT OVERVIEW</p><h2>사업개요</h2></div>
        <dl>
          <div><dt>사업명</dt><dd>브레인시티 메디스파크 로제비앙 모아엘가</dd></div>
          <div><dt>대지위치</dt><dd>경기도 평택시 장안동 평택브레인시티 일반산업단지 6BL</dd></div>
          <div><dt>건축규모</dt><dd>지하 2층~지상 35층, 10개 동</dd></div>
          <div><dt>세대수</dt><dd>총 1,215세대</dd></div>
          <div><dt>주택형</dt><dd>59A·59B·84A·84B·101㎡</dd></div>
          <div><dt>주차대수</dt><dd>총 1,722대(공동주택 1,715대)</dd></div>
        </dl>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-copy">
          <p className="eyebrow">PRIVATE CONSULTATION</p>
          <h2>메디스파크의<br />입지와 공간을<br />직접 확인하세요</h2>
          <p>이름과 연락처를 남겨주시면<br />담당자가 순차적으로 안내해 드립니다.</p>
          <a href={PHONE_LINK} className="big-call"><small>분양 상담</small>{PHONE_DISPLAY}</a>
        </div>
        <form className="lead-form" onSubmit={submitLead}>
          <div className="form-heading"><span>01</span><div><h3>상담 신청</h3><p>필수 정보만 간단하게 남겨주세요.</p></div></div>
          <label>이름 <em>필수</em><input name="name" required minLength={2} maxLength={30} placeholder="이름을 입력해 주세요" autoComplete="name" /></label>
          <label>연락처 <em>필수</em><input name="phone" required inputMode="tel" pattern="01[016789]-?[0-9]{3,4}-?[0-9]{4}" placeholder="010-0000-0000" autoComplete="tel" /></label>
          <div className="form-row">
            <label>관심 타입<select name="interestType" defaultValue="미정"><option>미정</option><option>84A</option><option>84B</option><option>101㎡</option><option>59㎡</option></select></label>
            <label>상담 희망 시간<select name="preferredTime" defaultValue=""><option value="">선택 안 함</option><option>오전 9시~12시</option><option>오후 12시~3시</option><option>오후 3시~6시</option></select></label>
          </div>
          <label className="check"><input type="checkbox" name="privacyConsent" required /><span><b>[필수]</b> 개인정보 수집·이용에 동의합니다.<small>분양 상담을 위해 이름과 연락처를 수집하며, 목적 달성 후 관계 법령과 운영정책에 따라 파기합니다.</small></span></label>
          <label className="check"><input type="checkbox" name="marketingConsent" /><span>[선택] 분양 소식 및 마케팅 정보 수신에 동의합니다.</span></label>
          <button className="submit" disabled={submitting}>{submitting ? "접수 중..." : "상담 신청하기"} <span>→</span></button>
          {message && <p className="form-message" role="status">{message}</p>}
        </form>
      </section>

      <section className="disclaimer">
        <p>※ 본 페이지의 조감도, 배치도, 평면도 및 주변 시설 이미지는 소비자의 이해를 돕기 위한 것으로 실제와 차이가 있을 수 있습니다.</p>
        <p>※ 학교, 병원, 교통 등 개발계획은 관계 기관의 사업 추진 및 인허가 과정에서 변경될 수 있습니다.</p>
        <p>※ 공급 및 청약에 관한 세부 사항은 승인된 입주자모집공고를 우선합니다.</p>
      </section>

      <footer>
        <div className="footer-brand"><span>브레인시티</span><strong>메디스파크</strong><p>로제비앙 모아엘가</p></div>
        <div><p>분양 상담</p><a href={PHONE_LINK}>{PHONE_DISPLAY}</a></div>
        <div className="footer-info"><p>경기도 평택시 장안동 평택브레인시티 일반산업단지 6BL</p><p>본 페이지는 분양 안내를 위한 홍보 페이지입니다.</p><p>© 2026 MEDISPARK. ALL RIGHTS RESERVED.</p></div>
      </footer>

      <div className="mobile-cta">
        <a href={PHONE_LINK}>전화 문의<br /><b>{PHONE_DISPLAY}</b></a>
        <a href="#contact">상담 신청 <span>→</span></a>
      </div>
    </main>
  );
}
