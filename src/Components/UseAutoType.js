// useAutotype.js
import { useState, useEffect } from 'react';

const UseAutotype = (texts, start, speed = 350) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(speed);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!start || done) return;

    let timer;
    if (isDeleting) {
      timer = setTimeout(() => {
        setText((prev) => prev.substring(0, prev.length - 1));
        setTypingSpeed(speed / 2);
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setText((prev) => texts[loopNum].substring(0, prev.length + 1));
      }, typingSpeed);
    }

    if (!isDeleting && text === texts[loopNum]) {
      if (loopNum === texts.length - 1) {
        setDone(true);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 500);
      }
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setLoopNum((prev) => (prev + 1) % texts.length);
      setTypingSpeed(speed);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, typingSpeed, texts, loopNum, speed, start, done]);

  return { text, done };
};

export default UseAutotype;
