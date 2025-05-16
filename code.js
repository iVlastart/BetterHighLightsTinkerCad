const flows = ["if", "else", "switch", "while", "do", "for", "goto"];
var vars = [];

const targetNode = document.body;

const config = {childList: true, subtree: true};

const callback = (mutationList, observer) => {
    for(const mutation of mutationList)
    {
        if(mutation.type === "childList")
        {
            const style = document.createElement('style');
            style.textContent = `
            .CodeMirror, .CodeMirror-lines {
                caret-color: white !important;
            }
                .CodeMirror .CodeMirror-cursor {
                border-left: 2px solid white !important;
            }
            `;
            document.head.appendChild(style);
            document.querySelectorAll("div[class='CodeMirror-scroll']").forEach(div=>{
                div.style.backgroundColor="black";
            });
            const semicols = document.querySelectorAll("span:not([class])");
            const keywords = document.querySelectorAll("span[class*='cm-keyword']");
            const varsSpan = document.querySelectorAll("span[class*='cm-variable']");
            const ops = document.querySelectorAll("span[class*='cm-operator']");
            const nums = document.querySelectorAll("span[class*='cm-number']");
            changeColors(keywords, "blue", "cm-keyword"); //blue as default if it fails somehow
            changeColors(varsSpan, "#9CDCFE", "cm-variable"); //default colour in case it fails somehow
            changeColors(ops, "white");
            changeColors(semicols, "white");
            changeColors(nums, "green");
            markUp(varsSpan);
            break;
        }
    }
}

const observer = new MutationObserver(callback);

observer.observe(targetNode, config);

function changeColors(arr, color, classes)
{
    arr.forEach(span => {
        switch(classes)
        {
            case "cm-keyword":
                span.style.color = flows.includes(span.textContent.trim()) ? "#C586C0" : "blue";
                break;
            case "cm-variable":
                const txt = span.innerHTML;
                span.style.color = "#9CDCFE";
                !vars.includes(txt) ? vars.push(txt) : null;
                break;
            default:
                span.style.color = color;
                break;
        }
        
    });
}

function markUp(spans) {
  spans.forEach(span => {
    span.setAttribute("tabindex", "0"); // make it focusable

    span.addEventListener("click", () => {
      const selectedText = span.textContent;

      // Clear previous highlights
      spans.forEach(s => {
        s.style.backgroundColor = "";
      });

      // Highlight all matching spans
      spans.forEach(s => {
        if (s.textContent === selectedText) {
          s.style.backgroundColor = "gray";
        }
      });

      span.focus(); // keep the clicked one focused
    });

    span.addEventListener("blur", () => {
        const selectedText = span.textContent;
        spans.forEach(s => {
            s.style.backgroundColor = "";
        });

        spans.forEach(s => {
            if (s.textContent === selectedText) {
                s.style.backgroundColor = "";
            }
        });
    });
  });
}