from flask import Flask, render_template, jsonify, request, send_from_directory, url_for
import os

app = Flask(__name__)

# Dados dos laboratórios de cyber segurança - Expandido com mais opções
labs = [
    # Categoria: Kali Linux
    {
        "id": 1,
        "titulo": "Introdução ao Kali Linux",
        "descricao": "Aprenda os comandos básicos e ferramentas essenciais do Kali Linux",
        "duracao": "15m",
        "tarefas": 3,
        "categoria": "Kali Linux",
        "video": True,
        "desafio_timer": False,
        "pacotes": ["kali-linux-core", "man-db", "nano"]
    },
    {
        "id": 2,
        "titulo": "Ferramentas de Informação do Sistema Kali",
        "descricao": "Aprenda a usar ferramentas para obter informações detalhadas sobre o sistema",
        "duracao": "20m",
        "tarefas": 4,
        "categoria": "Kali Linux",
        "video": False,
        "desafio_timer": False,
        "pacotes": ["net-tools", "htop", "neofetch", "inxi"]
    },
    {
        "id": 3,
        "titulo": "Configuração Avançada do Kali Linux",
        "descricao": "Configure o Kali Linux para máximo desempenho e personalização",
        "duracao": "30m",
        "tarefas": 5,
        "categoria": "Kali Linux",
        "video": True,
        "desafio_timer": False,
        "pacotes": ["kali-tweaks", "gnome-tweaks", "git"]
    },
    
    # Categoria: Scanning
    {
        "id": 4,
        "titulo": "Análise de Vulnerabilidades com Nmap",
        "descricao": "Aprenda a usar o Nmap para identificar hosts e serviços em uma rede",
        "duracao": "20m",
        "tarefas": 4,
        "categoria": "Scanning",
        "video": False,
        "desafio_timer": True,
        "pacotes": ["nmap", "ncat", "ndiff"]
    },
    {
        "id": 5,
        "titulo": "Scanning Avançado com Nessus",
        "descricao": "Utilize o Nessus para realizar scans profundos de vulnerabilidades",
        "duracao": "25m",
        "tarefas": 3,
        "categoria": "Scanning",
        "video": True,
        "desafio_timer": False,
        "pacotes": ["nessus", "openvas", "curl"]
    },
    {
        "id": 6,
        "titulo": "Reconhecimento Passivo com OSINT",
        "descricao": "Técnicas de coleta de informações sem interação direta com o alvo",
        "duracao": "30m",
        "tarefas": 4,
        "categoria": "Scanning",
        "video": False,
        "desafio_timer": True,
        "pacotes": ["maltego", "recon-ng", "theharvester", "whois"]
    },
    
    # Categoria: Redes
    {
        "id": 7,
        "titulo": "Fundamentos de Segurança em Redes",
        "descricao": "Aprenda conceitos essenciais sobre segurança em redes e protocolos",
        "duracao": "25m",
        "tarefas": 3,
        "categoria": "Redes",
        "video": True,
        "desafio_timer": False,
        "pacotes": ["wireshark", "tcpdump", "iptables"]
    },
    {
        "id": 8,
        "titulo": "Man-in-the-Middle Attacks",
        "descricao": "Entenda e pratique técnicas de interceptação de tráfego de rede",
        "duracao": "35m",
        "tarefas": 5,
        "categoria": "Redes",
        "video": True,
        "desafio_timer": True,
        "pacotes": ["ettercap", "bettercap", "arpspoof", "sslstrip"]
    },
    {
        "id": 9,
        "titulo": "Segurança Wi-Fi e Auditorias",
        "descricao": "Técnicas para auditoria de segurança em redes sem fio",
        "duracao": "30m",
        "tarefas": 4,
        "categoria": "Redes",
        "video": False,
        "desafio_timer": True,
        "pacotes": ["aircrack-ng", "wifite", "kismet", "macchanger"]
    },
    
    # Categoria: Análise
    {
        "id": 10,
        "titulo": "Captura e Análise de Pacotes com Wireshark",
        "descricao": "Aprenda a interceptar e analisar o tráfego de rede usando Wireshark",
        "duracao": "20m",
        "tarefas": 3,
        "categoria": "Análise",
        "video": True,
        "desafio_timer": False,
        "pacotes": ["wireshark", "tshark", "tcpdump"]
    },
    {
        "id": 11,
        "titulo": "Análise Forense de Dispositivos",
        "descricao": "Técnicas para análise forense de discos e recuperação de dados",
        "duracao": "40m",
        "tarefas": 6,
        "categoria": "Análise",
        "video": True,
        "desafio_timer": False,
        "pacotes": ["autopsy", "sleuthkit", "dd", "foremost"]
    },
    {
        "id": 12,
        "titulo": "Análise de Malware",
        "descricao": "Técnicas para analisar e entender o comportamento de malwares",
        "duracao": "35m",
        "tarefas": 5,
        "categoria": "Análise",
        "video": False,
        "desafio_timer": True,
        "pacotes": ["radare2", "cuckoo", "volatility", "yara"]
    },
    
    # Categoria: Web
    {
        "id": 13,
        "titulo": "Testes de Penetração Web",
        "descricao": "Aprenda a identificar e explorar vulnerabilidades em aplicações web",
        "duracao": "30m",
        "tarefas": 5,
        "categoria": "Web",
        "video": False,
        "desafio_timer": True,
        "pacotes": ["burpsuite", "owasp-zap", "nikto"]
    },
    {
        "id": 14,
        "titulo": "Exploração de SQL Injection",
        "descricao": "Técnicas avançadas para detectar e explorar vulnerabilidades de SQL Injection",
        "duracao": "25m",
        "tarefas": 4,
        "categoria": "Web",
        "video": True,
        "desafio_timer": False,
        "pacotes": ["sqlmap", "sqlninja", "havij"]
    },
    {
        "id": 15,
        "titulo": "Cross-Site Scripting (XSS) e CSRF",
        "descricao": "Entenda e aprenda a explorar vulnerabilidades XSS e CSRF",
        "duracao": "30m",
        "tarefas": 4,
        "categoria": "Web",
        "video": True,
        "desafio_timer": True,
        "pacotes": ["beef-xss", "xsser", "owasp-zap"]
    },
    
    # Categoria: Criptografia
    {
        "id": 16,
        "titulo": "Criptografia e Hash",
        "descricao": "Entenda os fundamentos de criptografia, hash e técnicas de codificação",
        "duracao": "15m",
        "tarefas": 3,
        "categoria": "Criptografia",
        "video": False,
        "desafio_timer": False,
        "pacotes": ["openssl", "gpg", "hashcat"]
    },
    {
        "id": 17,
        "titulo": "Quebra de Senhas e Hash",
        "descricao": "Técnicas avançadas para quebra de senhas e análise de hash",
        "duracao": "25m",
        "tarefas": 4,
        "categoria": "Criptografia",
        "video": True,
        "desafio_timer": True,
        "pacotes": ["john", "hashcat", "hydra", "crunch"]
    },
    {
        "id": 18,
        "titulo": "Esteganografia Digital",
        "descricao": "Aprenda a esconder e detectar informações em arquivos digitais",
        "duracao": "20m",
        "tarefas": 3,
        "categoria": "Criptografia",
        "video": False,
        "desafio_timer": False,
        "pacotes": ["steghide", "outguess", "stegosuite", "exiftool"]
    },
    
    # Categoria: Social
    {
        "id": 19,
        "titulo": "Engenharia Social",
        "descricao": "Aprenda técnicas de engenharia social e medidas de prevenção",
        "duracao": "15m",
        "tarefas": 3,
        "categoria": "Social",
        "video": True,
        "desafio_timer": False,
        "pacotes": ["set-toolkit", "maltego", "backdoor-factory"]
    },
    {
        "id": 20,
        "titulo": "Phishing Avançado",
        "descricao": "Crie campanhas de phishing sofisticadas e entenda como se proteger",
        "duracao": "30m",
        "tarefas": 5,
        "categoria": "Social",
        "video": True,
        "desafio_timer": True,
        "pacotes": ["gophish", "setoolkit", "beef", "phishx"]
    },
    {
        "id": 21,
        "titulo": "OSINT para Análise de Perfil",
        "descricao": "Use técnicas de OSINT para análise e pesquisa de informações pessoais",
        "duracao": "25m",
        "tarefas": 4,
        "categoria": "Social",
        "video": False,
        "desafio_timer": False,
        "pacotes": ["sherlock", "recon-ng", "maltego", "spiderfoot"]
    },
    
    # Categoria: Senhas
    {
        "id": 22,
        "titulo": "Exploração de Senhas com Hydra",
        "descricao": "Aprenda a realizar ataques de força bruta e dicionário usando o Hydra",
        "duracao": "20m",
        "tarefas": 2,
        "categoria": "Senhas",
        "video": False,
        "desafio_timer": True,
        "pacotes": ["hydra", "ncrack", "medusa", "wordlists"]
    },
    {
        "id": 23,
        "titulo": "Geração de Wordlists Customizadas",
        "descricao": "Crie wordlists personalizadas para ataques de força bruta eficientes",
        "duracao": "15m",
        "tarefas": 3,
        "categoria": "Senhas",
        "video": True,
        "desafio_timer": False,
        "pacotes": ["crunch", "cewl", "cupp", "pydictor"]
    },
    {
        "id": 24,
        "titulo": "Extração e Análise de Hashes",
        "descricao": "Extraia e analise hashes de diferentes sistemas e bancos de dados",
        "duracao": "25m",
        "tarefas": 4,
        "categoria": "Senhas",
        "video": False,
        "desafio_timer": True,
        "pacotes": ["hashcat", "john", "samdump2", "mimikatz"]
    }
]

# Comandos comuns do Kali Linux para o terminal virtual
comandos_kali = [
    {"comando": "ls", "descricao": "Listar arquivos e diretórios"},
    {"comando": "cd", "descricao": "Mudar de diretório"},
    {"comando": "pwd", "descricao": "Mostrar diretório atual"},
    {"comando": "nmap", "descricao": "Scanner de rede e portas"},
    {"comando": "ifconfig", "descricao": "Configuração de interfaces de rede"},
    {"comando": "ping", "descricao": "Testar conectividade de rede"},
    {"comando": "netstat", "descricao": "Estatísticas de rede"},
    {"comando": "hydra", "descricao": "Ferramenta de força bruta"},
    {"comando": "john", "descricao": "John the Ripper - Quebrador de senhas"},
    {"comando": "aircrack-ng", "descricao": "Suite para auditoria de redes WiFi"},
    {"comando": "wireshark", "descricao": "Analisador de pacotes de rede"},
    {"comando": "burpsuite", "descricao": "Ferramenta para teste de aplicações web"},
    {"comando": "sqlmap", "descricao": "Ferramenta para exploração de SQL Injection"},
    {"comando": "metasploit", "descricao": "Framework para exploração de vulnerabilidades"},
    {"comando": "apt-get install", "descricao": "Instalar pacotes no Kali Linux"},
    {"comando": "apt-get update", "descricao": "Atualizar lista de pacotes disponíveis"},
    {"comando": "apt-get remove", "descricao": "Remover pacotes do sistema"},
    {"comando": "wget", "descricao": "Baixar arquivos da web"},
    {"comando": "chmod", "descricao": "Alterar permissões de arquivos"},
    {"comando": "grep", "descricao": "Buscar padrões em arquivos"},
    {"comando": "hashcat", "descricao": "Ferramenta para quebra de hash"},
    {"comando": "nikto", "descricao": "Scanner de vulnerabilidades web"},
    {"comando": "dirb", "descricao": "Scanner de diretórios web"},
    {"comando": "steghide", "descricao": "Ferramenta de esteganografia"},
]

# Função para converter a categoria para uso em classes CSS
def category_class(category):
    return category.lower().replace(' ', '-')

# Registrar o filtro personalizado para Jinja2
app.jinja_env.filters['category_class'] = category_class

# Servir arquivos estáticos diretamente
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

# Rota da página inicial
@app.route('/')
def index():
    # Passar todos os laboratórios para o template
    return render_template('index.html', labs=labs)

# Rota sobre o laboratório
@app.route('/sobre')
def sobre():
    return render_template('sobre.html')

# Adicione esta nova rota ao seu arquivo app.py existente

# Rota para a página de vagas
@app.route('/vagas')
def vagas():
    return render_template('vagas.html')

# Rota para a página de roadmap
@app.route('/roadmap')
def roadmap():
    return render_template('roadmap.html')

    # Adicione esta nova rota ao seu arquivo app.py existente

# Lista de categorias de scripts
script_categories = [
    {"id": "red-team", "nome": "Red Team", "descricao": "Ferramentas e técnicas ofensivas para simular ataques reais"},
    {"id": "blue-team", "nome": "Blue Team", "descricao": "Ferramentas e técnicas defensivas para detecção e resposta a incidentes"},
    {"id": "pentesting", "nome": "Penetration Testing", "descricao": "Metodologias e ferramentas para testes de penetração estruturados"},
    {"id": "exploits", "nome": "Exploits", "descricao": "Códigos que exploram vulnerabilidades específicas em sistemas"},
    {"id": "recon", "nome": "Reconhecimento", "descricao": "Técnicas para coleta de informações e mapeamento de alvos"},
    {"id": "post-exploit", "nome": "Pós-Exploração", "descricao": "Técnicas para uso após ganhar acesso inicial a um sistema"},
    {"id": "crypto", "nome": "Criptografia", "descricao": "Ferramentas para análise e quebra de criptografia"},
    {"id": "network", "nome": "Redes", "descricao": "Scripts para análise e manipulação de tráfego de rede"},
    {"id": "web", "nome": "Web Hacking", "descricao": "Ferramentas específicas para exploração de aplicações web"},
    {"id": "malware", "nome": "Análise de Malware", "descricao": "Técnicas para análise e engenharia reversa de malware"}
]

# Rota para a página de scripts
@app.route('/scripts')
def scripts():
    return render_template('scripts.html', categories=script_categories)

# Rota para uma categoria específica de scripts
@app.route('/scripts/<categoria>')
def scripts_category(categoria):
    # Verificar se a categoria existe
    category = next((cat for cat in script_categories if cat["id"] == categoria), None)
    if not category:
        return "Categoria não encontrada", 404
    
    return render_template('scripts_category.html', category=category)

# Rota para um script específico
@app.route('/scripts/<categoria>/<script_id>')
def script_detail(categoria, script_id):
    # Verificar se a categoria existe
    category = next((cat for cat in script_categories if cat["id"] == categoria), None)
    if not category:
        return "Categoria não encontrada", 404
    
    # Aqui você poderia carregar detalhes específicos do script com base no script_id
    # Para simplificar, usaremos um template genérico
    return render_template('script_detail.html', category=category, script_id=script_id)

# Rota para página de laboratório específico
@app.route('/lab/<int:lab_id>')
def lab_page(lab_id):
    # Buscar laboratório pelo ID
    lab = next((lab for lab in labs if lab['id'] == lab_id), None)
    if lab:
        # Passar o laboratório e todos os comandos para o template
        return render_template('lab.html', lab=lab, comandos=comandos_kali)
    return "Laboratório não encontrado", 404

# Rota para listar todos os laboratórios (API)
@app.route('/api/laboratorios')
def get_labs():
    return jsonify(labs)

# Rota para filtrar laboratórios por categoria (API)
@app.route('/api/laboratorios/categoria/<categoria>')
def get_labs_by_category(categoria):
    if categoria.lower() == 'todos':
        return jsonify(labs)
    
    # Filtrar laboratórios pela categoria fornecida
    filtered_labs = [lab for lab in labs if lab['categoria'].lower() == categoria.lower()]
    return jsonify(filtered_labs)

# Rota para obter detalhes de um laboratório específico (API)
@app.route('/api/laboratorios/<int:lab_id>')
def get_lab(lab_id):
    lab = next((lab for lab in labs if lab['id'] == lab_id), None)
    if lab:
        return jsonify(lab)
    return jsonify({"error": "Laboratório não encontrado"}), 404

# Rota para obter comandos do Kali Linux (API)
@app.route('/api/comandos')
def get_comandos():
    return jsonify(comandos_kali)

# Rota para processar comandos do terminal virtual (API)
@app.route('/api/terminal', methods=['POST'])
def process_command():
    data = request.json
    command = data.get('command', '').strip()
    lab_id = data.get('lab_id', None)
    
    # Obter pacotes do laboratório se um lab_id foi fornecido
    lab_packages = []
    if lab_id:
        try:
            lab_id = int(lab_id)
            lab = next((lab for lab in labs if lab['id'] == lab_id), None)
            if lab:
                lab_packages = lab.get('pacotes', [])
        except (ValueError, TypeError):
            # Se lab_id não for um inteiro válido, ignoramos
            pass
    
    # Processamento de comandos específicos para instalação de pacotes
    if command.startswith('apt-get install '):
        package = command.split(' ')[-1]
        if package in lab_packages:
            return jsonify({
                "output": f"Lendo listas de pacotes... Pronto\nConstruindo árvore de dependências... Pronto\nLendo informações de estado... Pronto\nOs seguintes pacotes NOVOS serão instalados:\n  {package}\n0 atualizados, 1 novos instalados, 0 a serem removidos e 0 não atualizados.\nPrec:1 http://kali.download/kali kali-rolling/main amd64 {package} amd64 1:2.0-1\nBaixados 2.505 kB em 1s (2.505 kB/s)\nSelecionando {package} previamente não selecionado.\nPreparando para desempacotar ./{package}.deb ...\nDesempacotando {package} (1:2.0-1) ...\nConfigurando {package} (1:2.0-1) ...\nProcessando gatilhos para man-db (2.10.2-1) ...\n",
                "package_installed": True
            })
        else:
            return jsonify({
                "output": f"E: Impossível encontrar o pacote {package}",
                "package_installed": False
            })
    elif command.startswith('apt-get remove '):
        package = command.split(' ')[-1]
        return jsonify({
            "output": f"Lendo listas de pacotes... Pronto\nConstruindo árvore de dependências... Pronto\nLendo informações de estado... Pronto\nOs seguintes pacotes serão REMOVIDOS:\n  {package}\n0 atualizados, 0 novos instalados, 1 a serem removidos e 0 não atualizados.\nLib.: 1.505 kB de espaço em disco serão liberados após esta operação.\nRemov: {package} (1:2.0-1)\nRemovendo {package} (1:2.0-1) ...\nProcessando gatilhos para man-db (2.10.2-1) ...",
            "package_removed": True
        })
    elif command == 'apt-get update':
        return jsonify({
            "output": "Atingido:1 http://kali.download/kali kali-rolling InRelease\nBaixados 6.450 kB em 3s (2.150 kB/s)\nLendo listas de pacotes... Pronto"
        })
    # Processamento de comandos padrão
    elif command == 'ls':
        return jsonify({"output": "documentos  ferramentas  logs  scripts"})
    elif command.startswith('cd '):
        return jsonify({"output": f"Diretório alterado para {command[3:]}"})
    elif command == 'pwd':
        return jsonify({"output": "/home/kali"})
    elif command == 'help':
        return jsonify({"output": "Comandos disponíveis: ls, cd, pwd, help, clear, apt-get install, apt-get update, apt-get remove, ifconfig, nmap, wget, hydra, metasploit"})
    elif command == 'clear':
        return jsonify({"output": "clear"})
    elif command.startswith('nmap '):
        target = command.split()[1] if len(command.split()) > 1 else "localhost"
        return jsonify({"output": f"Iniciando Nmap 7.92...\nScanning {target}...\nDiscovered open port: 80/tcp (HTTP)\nDiscovered open port: 443/tcp (HTTPS)\nDiscovered open port: 22/tcp (SSH)\nNmap done: 1 IP address scanned in 2.34 seconds"})
    elif command.startswith('wget '):
        url = command.split()[1] if len(command.split()) > 1 else "http://example.com/arquivo.txt"
        return jsonify({"output": f"--2025-03-28 12:34:56--  {url}\nResolvendo {url.split('/')[2]}... 93.184.216.34\nConectando-se a {url.split('/')[2]}|93.184.216.34|:80... conectado.\nHTTP requisição enviada, aguardando resposta... 200 OK\nTamanho: 1234 (1.2K) [text/plain]\nSalvando em: 'arquivo.txt'\n\narquivo.txt          100%[===================>]   1.2K  --.-KB/s    em 0.001s  \n\n2025-03-28 12:34:56 (1.2 MB/s) - 'arquivo.txt' salvo [1234/1234]"})
    elif command.startswith('hydra '):
        return jsonify({"output": "Hydra v9.3 (c) 2021 by van Hauser/THC & David Maciejak - for legal purposes only\n\nHydra starting at 2025-03-28 12:34:56\n[DATA] max 16 tasks per 1 server, overall 16 tasks, 86 login tries (l:1/p:86), ~5 tries per task\n[DATA] attacking ssh://192.168.1.1:22/\n[22][ssh] host: 192.168.1.1   login: admin   password: password123\n1 of 1 target successfully completed, 1 valid password found\nHydra finished at 2025-03-28 12:35:26"})
    elif command == 'ifconfig':
        return jsonify({"output": "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 192.168.1.5  netmask 255.255.255.0  broadcast 192.168.1.255\n        inet6 fe80::a00:27ff:fe74:5d25  prefixlen 64  scopeid 0x20<link>\n        ether 08:00:27:74:5d:25  txqueuelen 1000  (Ethernet)\n        RX packets 12384  bytes 13292045 (12.6 MiB)\n        RX errors 0  dropped 0  overruns 0  frame 0\n        TX packets 6912  bytes 805627 (786.7 KiB)\n        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0"})
    # Continuação da função process_command, trecho específico para o comando metasploit/msfconsole
    elif command == 'metasploit' or command == 'msfconsole':
        return jsonify({"output": 
            "                                                  \n"
            "                          ########                  #\n"
            "                      #################            #\n"
            "                   ######################         #\n"
            "                  #########################      #\n"
            "                ############################\n"
            "               ##############################\n"
            "               ###############################\n"
            "              ###############################\n"
            "              ##############################\n"
            "                              #    ########   #\n"
            "                 ##        ###        ####   ##\n"
            "                                      ###   ###\n"
            "                                    ####   ###\n"
            "               ####          ##########   ####\n"
            "               #######################   ####\n"
            "                 ####################   ####\n"
            "                  ##################  ####\n"
            "                    ############      ##\n"
            "                       ########        ###\n"
            "                      #########        #####\n"
            "                   ############      ######\n"
            "                   ########         #########\n"
            "                     #####       ############\n"
            "                       ###       #############\n"
            "                      ######    ##############\n"
            "                     #######################\n"
            "                     #   #   ###  #   #   ##\n"
            "                     ########################\n"
            "                      ##     ##   ##     ##\n"
            "                            https://metasploit.com\n\n"
            "       =[ metasploit v6.2.27-dev                          ]\n"
            "+ -- --=[ 2230 exploits - 1178 auxiliary - 398 post       ]\n"
            "+ -- --=[ 867 payloads - 45 encoders - 11 nops            ]\n"
            "+ -- --=[ 9 evasion                                       ]\n\n"
            "Metasploit tip: Save the current environment with the save command\n\n"
            "msf6 >"
        })
    else:
        return jsonify({"output": f"Comando '{command}' não reconhecido. Digite 'help' para ver os comandos disponíveis."})

if __name__ == '__main__':
    # Certifique-se de que os diretórios necessários existam
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    
    # Inicia a aplicação
    app.run(debug=True, host='0.0.0.0', port=5000)