document.addEventListener('DOMContentLoaded', () => {
  // Animate statistics numbers
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateNumber = (element, target) => {
    const duration = 2000;
    const steps = 50;
    const stepValue = target / steps;
    let current = 0;
    
    const updateNumber = () => {
      current += stepValue;
      if (current > target) current = target;
      element.textContent = Math.round(current);
      
      if (current < target) {
        requestAnimationFrame(updateNumber);
      }
    };
    
    updateNumber();
  };
  
  // Intersection Observer for statistics animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.value);
        animateNumber(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  statNumbers.forEach(number => observer.observe(number));
});