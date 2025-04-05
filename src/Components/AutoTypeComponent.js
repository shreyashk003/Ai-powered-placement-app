import React,{useEffect, useState} from 'react'
import UseAutotype from './UseAutoType';
function AutoTypeComponent({typeStatus,outcome,name}) {
    
  const [startTyping, setStartTyping] = useState(false);
    const negativeText = ["Hello"+"  "+name+', Sorry, You are not likey to be placed', 'Do prepare well on your General Aptitude', 'Further, you are advised to improvise on your coding and technical skills'];
    const positiveText=["Hello"+"  "+name,"Hearty Congratulations, You are likey to be placed", "Do prepare well on your General Aptitude", "Further, you are advised to fruther improvise on your coding and technical skills"];
    const [isSpeaking,setIsSpeaking]=useState(false)
    var text=""
    useEffect(()=>{
      
    },[typeStatus])       
    const speakText = async (text) => {
      if ('speechSynthesis' in window) {
      
      const utterance = new SpeechSynthesisUtterance(text);    

        setIsSpeaking(true)
        window.speechSynthesis.speak(utterance);
       
        utterance.onend = () => {
          setIsSpeaking(false) 
        };

      } else {
        alert('Sorry, your browser does not support text-to-speech.');
      }
    };
    
    if(outcome==="0"){
      setStartTyping(true)
    var { text, done } = UseAutotype(negativeText, startTyping, 80);
    speakText(negativeText)
   
    }
    else if(outcome==="1"){
      setStartTyping(true)
      var {text,done}=UseAutotype(positiveText,startTyping,80);
      speakText(positiveText)
  }
 
    
return (
      <div>
        <p style={{color:'red',margin:'10px'}}>{text}</p>
      </div>
    );
}

export default AutoTypeComponent