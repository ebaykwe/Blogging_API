const calculateReadingTime = (text) => {
    const wordsPerMinute = 250;  
    const words = text.split(/\s+/).length;
    const minutes = words / wordsPerMinute;
    return Math.ceil(minutes);
  };
  
  export {calculateReadingTime};
  
