import React, { useState } from 'react';
import '../css/tooltip.css';
const Tooltip = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div 
      className="tooltip-container"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && <div className="tooltip">ChatGPTに野菜の専門家になりきってもらい、入力された特徴を持つ野菜について、<br></br>生産者・消費者にとってどんなメリットがあるかを説明するAIです。</div>}
    </div>
  );
};

export default Tooltip;