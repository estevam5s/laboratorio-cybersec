// Script principal para o laboratório de cyber segurança

document.addEventListener('DOMContentLoaded', function() {
  // Carregar os laboratórios
  fetchLaboratorios();
  
  // Configurar os filtros
  setupFilters();
  
  // Configurar o terminal
  setupTerminal();
});

// Função para buscar os laboratórios da API
async function fetchLaboratorios(categoria = 'Todos') {
  try {
      let url = '/api/laboratorios';
      if (categoria !== 'Todos') {
          url = `/api/laboratorios/categoria/${categoria}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      renderLaboratorios(data);
  } catch (error) {
      console.error('Erro ao carregar laboratórios:', error);
      
      // Dados de exemplo para desenvolvimento frontend (caso a API não esteja disponível)
      const dadosExemplo = [
          {
              "id": 1,
              "titulo": "Introdução ao Kali Linux",
              "descricao": "Aprenda os comandos básicos e ferramentas essenciais do Kali Linux",
              "duracao": "15m",
              "tarefas": 3,
              "categoria": "Kali Linux",
              "video": true,
              "desafio_timer": false
          },
          {
              "id": 2,
              "titulo": "Análise de Vulnerabilidades com Nmap",
              "descricao": "Aprenda a usar o Nmap para identificar hosts e serviços em uma rede",
              "duracao": "20m",
              "tarefas": 4,
              "categoria": "Scanning",
              "video": false,
              "desafio_timer": true
          }
      ];
      
      renderLaboratorios(dadosExemplo);
  }
}

// Função para renderizar os laboratórios na página
function renderLaboratorios(labs) {
  const container = document.getElementById('labsContainer');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (labs.length === 0) {
      container.innerHTML = '<div class="no-labs">Nenhum laboratório encontrado para esta categoria.</div>';
      return;
  }
  
  labs.forEach(lab => {
      let categoryClass = '';
      switch (lab.categoria.toLowerCase()) {
          case 'kali linux':
              categoryClass = 'category-kali';
              break;
          case 'scanning':
              categoryClass = 'category-scanning';
              break;
          case 'redes':
              categoryClass = 'category-redes';
              break;
          case 'análise':
              categoryClass = 'category-analise';
              break;
          case 'web':
              categoryClass = 'category-web';
              break;
          case 'criptografia':
              categoryClass = 'category-criptografia';
              break;
          case 'social':
              categoryClass = 'category-social';
              break;
          case 'senhas':
              categoryClass = 'category-senhas';
              break;
          default:
              categoryClass = 'category-kali';
      }
      
      const labCard = document.createElement('div');
      labCard.className = 'lab-card';
      labCard.innerHTML = `
          <div class="lab-card-content">
              <span class="category-badge ${categoryClass}">${lab.categoria}</span>
              <h3>${lab.titulo}</h3>
              <p>${lab.descricao}</p>
              <div class="lab-meta">
                  <span><i class="fas fa-clock"></i> Duração: ${lab.duracao}</span>
                  <span><i class="fas fa-tasks"></i> Tarefas: ${lab.tarefas}</span>
              </div>
              <div class="lab-tags">
                  ${lab.video ? '<span class="lab-tag video"><i class="fas fa-video"></i> Vídeo</span>' : ''}
                  ${lab.desafio_timer ? '<span class="lab-tag desafio"><i class="fas fa-stopwatch"></i> Desafio com Timer</span>' : ''}
              </div>
              <a href="/lab/${lab.id}" class="start-lab-btn">Iniciar Laboratório</a>
          </div>
      `;
      
      container.appendChild(labCard);
  });
}

// Configurar os botões de filtro
function setupFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (filterButtons.length === 0) return;
  
  filterButtons.forEach(button => {
      button.addEventListener('click', () => {
          // Remover classe ativa de todos os botões
          filterButtons.forEach(btn => btn.classList.remove('active'));
          
          // Adicionar classe ativa ao botão clicado
          button.classList.add('active');
          
          // Filtrar laboratórios
          const categoria = button.getAttribute('data-category');
          fetchLaboratorios(categoria);
      });
  });
}

// Configurar o terminal virtual
function setupTerminal() {
  const terminalBtn = document.getElementById('terminalBtn');
  const terminalModal = document.getElementById('terminalModal');
  const closeBtn = document.querySelector('.close');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  
  if (!terminalBtn || !terminalModal) return;
  
  // Carregar comandos do Kali Linux
  fetchComandosKali();
  
  // Abrir o terminal
  terminalBtn.addEventListener('click', () => {
      terminalModal.style.display = 'block';
      terminalInput.focus();
  });
  
  // Fechar o terminal
  closeBtn.addEventListener('click', () => {
      terminalModal.style.display = 'none';
  });
  
  // Fechar o terminal ao clicar fora dele
  window.addEventListener('click', (e) => {
      if (e.target === terminalModal) {
          terminalModal.style.display = 'none';
      }
  });
  
  // Processar comandos do terminal
  terminalInput.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
          const command = terminalInput.value.trim();
          if (command === '') return;
          
          // Adicionar comando à saída
          const commandLine = document.createElement('p');
          commandLine.innerHTML = `<span class="prompt">kali@cyberlab:~$</span> ${command}`;
          terminalOutput.appendChild(commandLine);
          
          // Limpar input
          terminalInput.value = '';
          
          // Processar comando
          try {
              const response = await fetch('/api/terminal', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ command })
              });
              
              const data = await response.json();
              
              // Comando para limpar o terminal
              if (command === 'clear' || data.output === 'clear') {
                  terminalOutput.innerHTML = '';
                  return;
              }
              
              // Adicionar resultado à saída
              const resultLine = document.createElement('p');
              resultLine.textContent = data.output;
              terminalOutput.appendChild(resultLine);
              
              // Rolar para o final do terminal
              terminalOutput.scrollTop = terminalOutput.scrollHeight;
          } catch (error) {
              console.error('Erro ao processar comando:', error);
              
              // Resposta simulada caso a API não esteja disponível
              const commands = {
                  'ls': 'documentos  ferramentas  logs  scripts',
                  'pwd': '/home/kali',
                  'help': 'Comandos disponíveis: ls, cd, pwd, help, clear',
                  'nmap -sS 192.168.1.1': 'Iniciando Nmap 7.92...\nScanning 192.168.1.1...\nNmap done: 1 IP address scanned in 2.05 seconds',
                  'ifconfig': 'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 192.168.1.5  netmask 255.255.255.0  broadcast 192.168.1.255'
              };
              
              let output = '';
              
              if (command.startsWith('cd ')) {
                  output = `Diretório alterado para ${command.slice(3)}`;
              } else if (command === 'clear') {
                  terminalOutput.innerHTML = '';
                  return;
              } else {
                  output = commands[command] || `Comando '${command}' não reconhecido. Digite 'help' para ver os comandos disponíveis.`;
              }
              
              const resultLine = document.createElement('p');
              resultLine.textContent = output;
              terminalOutput.appendChild(resultLine);
              
              // Rolar para o final do terminal
              terminalOutput.scrollTop = terminalOutput.scrollHeight;
          }
      }
  });
}

// Buscar comandos do Kali Linux
async function fetchComandosKali() {
  try {
      const response = await fetch('/api/comandos');
      const comandos = await response.json();
      
      renderComandosKali(comandos);
  } catch (error) {
      console.error('Erro ao carregar comandos:', error);
      
      // Dados de exemplo para desenvolvimento (caso a API não esteja disponível)
      const comandosExemplo = [
          {"comando": "ls", "descricao": "Listar arquivos e diretórios"},
          {"comando": "cd", "descricao": "Mudar de diretório"},
          {"comando": "nmap", "descricao": "Scanner de rede e portas"},
          {"comando": "ifconfig", "descricao": "Configuração de interfaces de rede"}
      ];
      
      renderComandosKali(comandosExemplo);
  }
}

// Renderizar lista de comandos
function renderComandosKali(comandos) {
  const comandosContainer = document.getElementById('comandosKali');
  if (!comandosContainer) return;
  
  comandosContainer.innerHTML = '';
  
  comandos.forEach(cmd => {
      const comandoItem = document.createElement('div');
      comandoItem.className = 'comando-item';
      comandoItem.innerHTML = `<span>${cmd.comando}</span> - ${cmd.descricao}`;
      
      comandosContainer.appendChild(comandoItem);
  });
}