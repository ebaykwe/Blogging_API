const calculateReadingTime = (text) => {
    const wordsPerMinute = 250;  // Average reading speed of an adult
    const words = text.split(/\s+/).length;
    const minutes = words / wordsPerMinute;
    return Math.ceil(minutes);
  };
  
  export {calculateReadingTime};
  