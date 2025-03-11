import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <span className="loader-text">loading</span>
        <span className="load" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  background: transparent; /* Set background to transparent */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height for centering */

  .loader {
    width: 160px; /* Increased width */
    height: 100px; /* Increased height */
    position: relative;
  }

  .loader-text {
    position: absolute;
    top: 0;
    padding: 0;
    margin: 0;
    color: #4A154B;
    animation: text_713 3.5s ease both infinite;
    font-size: 1.2rem; /* Increased font size */
    letter-spacing: 2px; /* Increased letter spacing */
  }

  .load {
    background-color: #4A154B;
    border-radius: 50px;
    display: block;
    height: 24px; /* Increased height */
    width: 24px; /* Increased width */
    bottom: 0;
    position: absolute;
    transform: translateX(128px); /* Adjusted for larger size */
    animation: loading_713 3.5s ease both infinite;
  }

  .load::before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-color: #D1C2FF;
    border-radius: inherit;
    animation: loading2_713 3.5s ease both infinite;
  }

  @keyframes text_713 {
    0% {
      letter-spacing: 2px; /* Adjusted for larger size */
      transform: translateX(0px);
    }

    40% {
      letter-spacing: 4px; /* Adjusted for larger size */
      transform: translateX(52px); /* Adjusted for larger size */
    }

    80% {
      letter-spacing: 2px; /* Adjusted for larger size */
      transform: translateX(64px); /* Adjusted for larger size */
    }

    90% {
      letter-spacing: 4px; /* Adjusted for larger size */
      transform: translateX(0px);
    }

    100% {
      letter-spacing: 2px; /* Adjusted for larger size */
      transform: translateX(0px);
    }
  }

  @keyframes loading_713 {
    0% {
      width: 24px; /* Adjusted for larger size */
      transform: translateX(0px);
    }

    40% {
      width: 100%;
      transform: translateX(0px);
    }

    80% {
      width: 24px; /* Adjusted for larger size */
      transform: translateX(128px); /* Adjusted for larger size */
    }

    90% {
      width: 100%;
      transform: translateX(0px);
    }

    100% {
      width: 24px; /* Adjusted for larger size */
      transform: translateX(0px);
    }
  }

  @keyframes loading2_713 {
    0% {
      transform: translateX(0px);
      width: 24px; /* Adjusted for larger size */
    }

    40% {
      transform: translateX(0%);
      width: 80%;
    }

    80% {
      width: 100%;
      transform: translateX(0px);
    }

    90% {
      width: 80%;
      transform: translateX(30px); /* Adjusted for larger size */
    }

    100% {
      transform: translateX(0px);
      width: 24px; /* Adjusted for larger size */
    }
  }
`;

export default Loader;