// Checkbox Component for Saving Chats
const Checkbox = ({ onClick }) => (
    <StyledCheckboxWrapper>
      <label className="container" onClick={onClick}>
        <input type="checkbox" defaultChecked="checked" />
        <svg className="save-regular" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
          <path d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z" />
        </svg>
        <svg className="save-solid" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
          <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" />
        </svg>
      </label>
    </StyledCheckboxWrapper>
  );
  
  // Styled Components
  const StyledCheckboxWrapper = styled.div`
    .container {
      --color: #9d16be;
      --size: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      cursor: pointer;
      font-size: var(--size);
      user-select: none;
      fill: var(--color);
      background: white;
      padding: 10px;
      border-radius: 50%;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }
  
    .container .save-regular {
      position: absolute;
      animation: keyframes-fill 0.5s;
      transform-origin: top;
    }
  
    .container .save-solid {
      position: absolute;
      animation: keyframes-fill 0.5s;
      display: none;
      transform-origin: top;
    }
  
    .container input:checked ~ .save-regular {
      display: none;
    }
  
    .container input:checked ~ .save-solid {
      display: block;
    }
  
    .container input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
  
    @keyframes keyframes-fill {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scaleY(1.2);
      }
    }
  `;