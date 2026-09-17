// Interactive terminal commands, history, window controls, and navigation.

const terminal = document.querySelector("[data-terminal]");
const terminalForm = document.querySelector("[data-terminal-form]");
const terminalInput = document.querySelector("[data-terminal-input]");
const terminalOutput = document.querySelector("[data-terminal-output]");
const terminalExpand = document.querySelector("[data-terminal-expand]");
const terminalToggle = document.querySelector("[data-terminal-toggle]");
const terminalClose = document.querySelector("[data-terminal-close]");

if (terminal && terminalForm && terminalInput && terminalOutput) {
  const resumeUrl = "https://drive.google.com/file/d/12K8Z2sb5uFqbBXeucd8AHHMx-eDDHIYc/view?usp=sharing";
  const externalDestinations = {
    github: "https://github.com/efliu7",
    linkedin: "https://www.linkedin.com/in/ethan-f-liu/",
    resume: resumeUrl,
  };
  const pageDestinations = {
    home: "index.html",
    projects: "projects.html",
    experience: "experience.html",
    about: "about.html",
  };
  const commandHistory = [];
  let historyIndex = 0;

  const appendTerminalLine = (text, className = "") => {
    const line = document.createElement("p");
    line.textContent = text;
    if (className) line.className = className;
    terminalOutput.append(line);

    while (terminalOutput.children.length > 24) {
      terminalOutput.firstElementChild?.remove();
    }

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  };

  const openDestination = (destination) => {
    if (pageDestinations[destination]) {
      appendTerminalLine(`opening ${destination}...`);
      window.location.assign(pageDestinations[destination]);
      return true;
    }

    if (externalDestinations[destination]) {
      appendTerminalLine(`opening ${destination}...`);
      window.open(externalDestinations[destination], "_blank", "noopener,noreferrer");
      return true;
    }

    return false;
  };

  // Exact commands live in one registry; parameterized commands are handled below it.
  const commands = new Map([
    ["clear", () => terminalOutput.replaceChildren()],
    ["help", () => {
      appendTerminalLine("help · about · projects · experience · skills · contact");
      appendTerminalLine("resume · open <page> · clear");
    }],
    ["about", () => appendTerminalLine("Software Engineering student at Western University, graduating June 2027.")],
    ["projects", () => {
      appendTerminalLine("Jet Aircraft Museum · traint · Inclusee · devCircle · Knight Quest");
      appendTerminalLine('try "open projects" for case studies');
    }],
    ["experience", () => {
      appendTerminalLine("AMD — Software Engineer Co-op");
      appendTerminalLine("Dream Studio 9 — Full-Stack Developer · RBC Insurance — Analyst");
    }],
    ["skills", () => {
      appendTerminalLine("TypeScript · JavaScript · C# · Java · Python · PHP · SQL");
      appendTerminalLine("React · Angular · Next.js · Node.js · .NET · Symfony");
    }],
    ["contact", () => {
      appendTerminalLine("LinkedIn: /in/ethan-f-liu · GitHub: @efliu7");
      appendTerminalLine('try "open linkedin" or "open github"');
    }],
    ["resume", () => openDestination("resume")],
    ["sudo hire ethan", () => {
      appendTerminalLine("permission granted. excellent choice.");
      appendTerminalLine('run "contact" to continue');
    }],
  ]);

  const runTerminalCommand = (rawCommand) => {
    const command = rawCommand.trim().toLowerCase().replace(/\s+/g, " ");
    if (!command) return;

    appendTerminalLine(`> ${rawCommand.trim()}`, "terminal-command");

    const commandHandler = commands.get(command);
    if (commandHandler) {
      commandHandler();
    } else if (command.startsWith("open ")) {
      const destination = command.slice(5).trim();
      if (!openDestination(destination)) {
        appendTerminalLine(`cannot open: ${destination}`, "terminal-error");
      }
    } else {
      appendTerminalLine(`command not found: ${command}`, "terminal-error");
      appendTerminalLine('type "help" for available commands');
    }
  };

  terminalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const command = terminalInput.value;
    if (!command.trim()) return;

    commandHistory.push(command);
    historyIndex = commandHistory.length;
    terminalInput.value = "";
    runTerminalCommand(command);
  });

  terminalInput.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();

    historyIndex += event.key === "ArrowUp" ? -1 : 1;
    historyIndex = Math.max(0, Math.min(historyIndex, commandHistory.length));
    terminalInput.value = commandHistory[historyIndex] ?? "";
    terminalInput.setSelectionRange(terminalInput.value.length, terminalInput.value.length);
  });

  terminal.addEventListener("click", (event) => {
    if (event.target.closest("a, button, input")) return;
    terminalInput.focus();
  });

  terminalExpand?.addEventListener("click", () => {
    const isExpanded = terminal.classList.toggle("is-expanded");
    terminalExpand.setAttribute("aria-pressed", String(isExpanded));
    terminalExpand.setAttribute("aria-label", isExpanded ? "Restore terminal size" : "Expand terminal");
    terminalExpand.title = isExpanded ? "Restore terminal size" : "Expand terminal";
    terminalInput.focus();
  });

  const setTerminalOpen = (isOpen) => {
    if (!terminalToggle) return;
    terminal.hidden = !isOpen;
    terminalToggle.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
      window.requestAnimationFrame(() => terminalInput.focus());
    } else {
      terminalToggle.focus();
    }
  };

  terminalToggle?.addEventListener("click", () => {
    setTerminalOpen(terminal.hidden);
  });

  terminalClose?.addEventListener("click", () => {
    setTerminalOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && terminalToggle && !terminal.hidden) {
      event.preventDefault();
      setTerminalOpen(false);
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.code === "Backquote" && terminalToggle) {
      event.preventDefault();
      setTerminalOpen(terminal.hidden);
    }
  });
}
