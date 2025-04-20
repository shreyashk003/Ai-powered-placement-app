import React, { useEffect, useState } from 'react';
import UseAutoType from './UseAutoType';

function AutoTypeComponent({ typeStatus, outcome, name }) {
  const [startTyping, setStartTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [textList, setTextList] = useState([]);

  const negativeText = [
    `Hello ${name}, Sorry, You are not likely to be placed.`,
    'Do prepare well on your General Aptitude.',
    'Further, you are advised to improvise on your coding and technical skills.'
  ];

  const positiveText = [
    `Hello ${name}`,
    'Hearty Congratulations, You are likely to be placed!',
    'Do prepare well on your General Aptitude.',
    'Further, you are advised to further improvise on your coding and technical skills.'
  ];

  // Choose text based on outcome
  useEffect(() => {
    if (typeStatus) {
      if (parseInt(outcome) === 0) {
        setTextList(negativeText);
        speakText(negativeText.join(' '));
      } else if (parseInt(outcome) === 1) {
        setTextList(positiveText);
        speakText(positiveText.join(' '));
      }
      setStartTyping(true);
    }
  }, [typeStatus, outcome, name]);

  // Use the hook after setting textList
  const { text } = UseAutoType(textList, startTyping, 80);

  const speakText = async (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
      utterance.onend = () => {
        setIsSpeaking(false);
      };
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  };

  return (
    <div>
      <p style={{ color: 'red', margin: '10px' }}>{text}</p>
    </div>
  );
}

export default AutoTypeComponent;