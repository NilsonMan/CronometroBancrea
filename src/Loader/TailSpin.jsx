import React from "react";
import styled, {keyframes} from "styled-components";


const spinAnimation = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerCircle = styled.div`
  animation: ${spinAnimation} 1.2s linear infinite;
  margin: 0 0.5em;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  border-radius: 50%;
  border: ${({ radius }) => radius}px solid ${({ color }) => color};
  border-color: ${({ color }) => color} transparent transparent transparent;
`;

const TailSpin = ({ height = 15, width = 15, color = "#e5e5e5", radius = 1 }) => {
  return <SpinnerCircle color={color} height={height} width={width}  radius={radius} />;
};

export default TailSpin;