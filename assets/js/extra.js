document.addEventListener("DOMContentLoaded", function () {
  const typingElement = document.getElementById('hero-typing');
  if (!typingElement) return; // Safely exit if not on the hero page

  const words = [
    "Geospatial Analyst",
    "Geospatial Consultant",
    "AI Data Specialist",
    "Database Designer"
  ];
  let i = 0;
  let timer;

  function typingEffect() {
    let word = words[i].split("");
    var loopTyping = function () {
      if (word.length > 0) {
        typingElement.innerHTML += word.shift();
      } else {
        setTimeout(deletingEffect, 2000);
        return false;
      }
      timer = setTimeout(loopTyping, 80);
    };
    loopTyping();
  }

  function deletingEffect() {
    let word = words[i].split("");
    var loopDeleting = function () {
      if (word.length > 0) {
        word.pop();
        typingElement.innerHTML = word.join("");
      } else {
        if (words.length > (i + 1)) {
          i++;
        } else {
          i = 0;
        }
        setTimeout(typingEffect, 500);
        return false;
      }
      timer = setTimeout(loopDeleting, 40);
    };
    loopDeleting();
  }

  typingEffect();
});