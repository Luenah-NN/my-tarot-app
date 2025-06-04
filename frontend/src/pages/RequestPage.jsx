// frontend/src/pages/RequestPage.jsx

import React, { useState } from 'react';

function RequestPage() {
  const [submitSucceeded, setSubmitSucceeded] = useState(false);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>✉️ 개발자에게 요청하기 ✉️</h2>
      {submitSucceeded ? (
        <p>요청이 정상적으로 접수되었습니다. 감사합니다!</p>
      ) : (
        <form
          name="request-form"
          method="POST"
          data-netlify="true"
          onSubmit={() => setSubmitSucceeded(true)}
        >
          {/* Netlify 폼 이름을 알려주는 숨겨진 필드 */}
          <input type="hidden" name="form-name" value="request-form" />

          {/* <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="userEmail">이메일(답변 받을 주소):</label>
            <br />
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div> */}

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="requestContent">요청 내용:</label>
            <br />
            <textarea
              id="requestContent"
              name="requestContent"
              rows="6"
              placeholder="원하시는 기능이나 의견을 적어주세요. 반영될지는 몰...루?"
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#0084ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            요청 보내기
          </button>
        </form>
      )}
    </div>
  );
}

export default RequestPage;
