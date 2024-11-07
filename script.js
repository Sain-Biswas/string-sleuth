function buildLPSArray(pattern) {
  const lps = new Array(pattern.length).fill(0);
  let length = 0;
  let i = 1;

  while (i < pattern.length) {
    if (pattern[i] === pattern[length]) {
      length++;
      lps[i] = length;
      i++;
    } else {
      if (length !== 0) {
        length = lps[length - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }
  return lps;
}

function kmpSearch() {
  const text = document.getElementById("textInput").value;
  const pattern = document.getElementById("patternInput").value;
  const highlightedTextDiv = document.getElementById("highlightedText");
  const lpsArrayDiv = document.getElementById("lpsArrayContainer");
  const foundAt = document.getElementById("foundAt");

  lpsArrayDiv.innerHTML = "";
  foundAt.innerHTML = "";
  foundAt.classList = "";

  if (!text || !pattern) {
    highlightedTextDiv.innerHTML = "<p>Please enter both text and pattern.</p>";
    return;
  }

  const lps = buildLPSArray(pattern);
  let i = 0; // index for text
  let j = 0; // index for pattern

  lps.forEach((val, ind) => {
    lpsArrayDiv.innerHTML += `<div class="lpsBlock">
              <div class="lpsElement">${pattern.charAt(ind)}</div>
              <div class="lpsIndex">${val}</div>
            </div>`;
  });

  const occurrences = [];

  while (i < text.length) {
    if (pattern[j] === text[i]) {
      i++;
      j++;
    }
    if (j === pattern.length) {
      occurrences.push(i - j);
      j = lps[j - 1];
    } else if (i < text.length && pattern[j] !== text[i]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  // Build the highlighted text with spans around matched patterns
  if (occurrences.length > 0) {
    let highlightedText = "";
    let lastIndex = 0;
    foundAt.innerHTML = occurrences.join(", ");
    foundAt.classList = "found";

    occurrences.forEach((matchIndex) => {
      highlightedText += text.slice(lastIndex, matchIndex); // add text before match
      highlightedText += `<span class="highlight">${text.slice(
        matchIndex,
        matchIndex + pattern.length
      )}</span>`; // highlight match
      lastIndex = matchIndex + pattern.length;
    });

    highlightedText += text.slice(lastIndex); // add remaining part of text
    highlightedTextDiv.innerHTML = highlightedText;
  } else {
    foundAt.classList = "notFound";
    foundAt.innerHTML = "Not Found";
    highlightedTextDiv.innerHTML =
      '<p class="notFound">Pattern not found in the text.</p>';
  }
}
