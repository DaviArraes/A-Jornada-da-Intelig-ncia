// Fases, cenários e banco de perguntas da aventura.
(() => {
  class LevelBuilder {
    constructor(cols, rows) { this.cols = cols; this.rows = rows; this.grid = Array.from({ length: rows }, () => Array(cols).fill('.')); }
    set(c, r, ch) { if (this.grid[r] && c >= 0 && c < this.cols) this.grid[r][c] = ch; return this; }
    fill(c1, r1, c2, r2, ch) { for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) this.set(c, r, ch); return this; }
    ground(pits = []) { this.fill(0, this.rows - 2, this.cols - 1, this.rows - 1, '#'); pits.forEach(([a,b]) => this.fill(a, this.rows - 2, b, this.rows - 1, '.')); return this; }
    stairs(c, base, n, dir = 1) { for (let i = 0; i < n; i++) this.fill(dir > 0 ? c + i : c - i, base - i, dir > 0 ? c + i : c - i, base, '#'); return this; }
  }
  const QUESTIONS = [
    ["O que significa a sigla IA?", ["Inteligência Artificial","Internet Automática","Informação Avançada","Instrução Analógica"],0,"IA é a abreviação de Inteligência Artificial."],
    ["O que a inteligência artificial permite que um computador faça?", ["Realizar tarefas como reconhecer padrões e responder a comandos","Funcionar sem energia","Sentir emoções como uma pessoa","Saber tudo sem receber informações"],0,"A IA executa tarefas usando dados e instruções."],
    ["O que é um algoritmo?", ["Uma sequência de passos para realizar uma tarefa","Uma peça que movimenta um robô","Um tipo de sensor","Uma rede sem fio"],0,"Algoritmos são conjuntos de passos ou regras."],
    ["Como muitos sistemas de IA aprendem?", ["Analisando exemplos e dados","Lendo pensamentos","Funcionando sem programação ou dados","Copiando o cérebro inteiro"],0,"Os exemplos ajudam a IA a identificar padrões."],
    ["O que são dados de treinamento?", ["Exemplos usados para ensinar um sistema de IA","A senha de um computador","As peças de um robô","Os cabos de uma rede"],0,"Dados de treinamento são exemplos analisados durante o aprendizado."],
    ["Qual tarefa pode ser feita por uma IA?", ["Reconhecer objetos em imagens","Trocar uma bateria sozinha em qualquer aparelho","Criar energia elétrica do nada","Garantir que toda resposta esteja certa"],0,"Reconhecer imagens é uma aplicação comum de IA."],
    ["Como um assistente virtual pode entender um pedido falado?", ["Usando reconhecimento de voz","Usando um sensor de temperatura","Lendo a tela da televisão","Movendo uma peça mecânica"],0,"O reconhecimento de voz transforma fala em informação que o sistema pode processar."],
    ["O que faz um sistema de recomendação?", ["Sugere conteúdos com base em preferências ou atividades","Conserta aparelhos quebrados","Mede a temperatura de uma sala","Controla diretamente todos os robôs"],0,"Recomendações usam dados para sugerir conteúdos ou produtos."],
    ["Uma ferramenta de tradução automática usa tecnologia para...", ["Converter textos de um idioma para outro","Conectar objetos à tomada","Medir distâncias","Montar peças de um robô"],0,"A tradução automática ajuda a converter textos entre idiomas."],
    ["O que uma IA generativa pode produzir?", ["Textos, imagens ou sons","Somente peças metálicas","Somente sinais de Wi-Fi","Energia para uma cidade"],0,"IA generativa cria conteúdos como textos, imagens e áudio."],
    ["Uma IA pode cometer erros?", ["Sim, por isso suas respostas podem precisar de revisão","Não, ela sempre acerta","Não, porque não usa dados","Sim, mas só quando está desligada"],0,"Sistemas de IA podem errar ou apresentar informações incorretas."],
    ["Por que é importante conferir uma resposta gerada por IA?", ["Porque ela pode conter erros ou informações inventadas","Porque a IA não consegue escrever frases","Porque toda resposta é secreta","Porque conferir apaga os dados"],0,"Conferir ajuda a identificar erros e verificar informações."],
    ["O que é reconhecimento facial?", ["Identificar ou comparar rostos usando um sistema","Reconhecer o som de um motor","Medir a velocidade da internet","Controlar a temperatura de uma sala"],0,"Reconhecimento facial analisa características de rostos."],
    ["O que uma IA pode identificar ao analisar muitas fotos de animais?", ["Padrões que ajudam a separar os tipos de animais","A senha de quem tirou as fotos","O peso exato de cada animal","O que os animais estão pensando"],0,"A IA pode aprender características visuais presentes nos exemplos."],
    ["Qual destes é um exemplo de IA usada no dia a dia?", ["Sugestões de vídeos ou músicas","Uma lâmpada comum sem conexão","Um caderno de papel","Uma chave de fenda"],0,"Plataformas podem usar IA para sugerir conteúdos."],
    ["A IA pensa e sente exatamente como uma pessoa?", ["Não; ela processa dados e executa tarefas","Sim; toda IA tem sentimentos","Sim; ela tem consciência humana","Não; IA só funciona em robôs"],0,"IA não tem sentimentos humanos; ela realiza tarefas computacionais."],
    ["O que é a Internet das Coisas, ou IoT?", ["A conexão de objetos à internet para trocar dados","Uma rede usada apenas por computadores grandes","Um tipo de inteligência artificial que escreve textos","Um grupo de robôs sem sensores"],0,"IoT conecta objetos capazes de enviar ou receber dados."],
    ["O que é um sensor?", ["Um componente que percebe ou mede algo","Um programa que escreve textos","Uma senha para entrar na internet","Um tipo de motor"],0,"Sensores medem características como luz, movimento ou temperatura."],
    ["Qual destes pode ser um sensor?", ["Sensor de temperatura","Teclado de papel","Cabo de energia sem medição","Alto-falante desligado"],0,"Sensores de temperatura medem o calor do ambiente."],
    ["O que um sensor de movimento detecta?", ["Movimento de pessoas ou objetos","A senha de uma rede","O idioma de um texto","A carga de uma bateria"],0,"Esse sensor percebe movimento em uma área."],
    ["Qual destes é um exemplo de objeto IoT?", ["Relógio inteligente conectado à internet","Livro impresso comum","Cadeira sem componentes eletrônicos","Lápis de madeira"],0,"Relógios inteligentes podem se conectar e trocar dados."],
    ["O que permite que um objeto IoT envie dados pela internet?", ["Uma conexão de rede, como Wi-Fi","Uma roda de borracha","Uma folha de papel","Um botão sem circuito"],0,"A conexão de rede permite a troca de dados."],
    ["O que pode acontecer com os dados medidos por um sensor conectado?", ["Eles podem ser enviados para um aplicativo ou sistema","Eles viram automaticamente energia","Eles deixam de existir imediatamente","Eles se transformam em peças"],0,"Dispositivos conectados podem enviar medições para outros sistemas."],
    ["Qual informação um relógio inteligente pode medir?", ["Batimentos cardíacos ou passos","A senha do roteador sem autorização","O pensamento de quem usa","A idade exata de qualquer pessoa"],0,"Alguns relógios medem passos e sinais do corpo."],
    ["O que é uma casa inteligente?", ["Uma casa com aparelhos conectados que podem ser monitorados ou controlados","Uma casa construída apenas por robôs","Uma casa sem eletricidade","Uma casa que funciona sem pessoas"],0,"Aparelhos conectados podem automatizar ou facilitar algumas funções da casa."],
    ["Um termostato inteligente pode ajudar a controlar...", ["A temperatura de um ambiente","A tradução de um livro","A velocidade de um robô industrial","A qualidade de uma senha"],0,"Termostatos medem e ajudam a ajustar a temperatura."],
    ["Para que serve um sensor de fumaça conectado?", ["Detectar fumaça e enviar um alerta","Reconhecer rostos em fotografias","Traduzir conversas","Controlar o trânsito"],0,"O sensor detecta fumaça e pode avisar as pessoas."],
    ["O que significa proteger a privacidade dos dados?", ["Controlar quem pode acessar informações pessoais","Publicar todas as informações na internet","Usar a mesma senha em todos os aparelhos","Desligar todos os sensores"],0,"Privacidade envolve proteger informações e controlar seu uso."],
    ["Por que aparelhos conectados precisam de senhas seguras?", ["Para dificultar o acesso de pessoas não autorizadas","Para aumentar o alcance do Wi-Fi","Para fazer o sensor medir melhor","Para impedir atualizações"],0,"Senhas seguras ajudam a proteger os dispositivos e seus dados."],
    ["Para que servem atualizações de segurança?", ["Corrigir falhas e proteger melhor o aparelho","Aumentar o tamanho físico do aparelho","Apagar todos os sensores","Transformar o aparelho em robô"],0,"Atualizações podem corrigir falhas de segurança."],
    ["O que é robótica?", ["A área que projeta, constrói e programa robôs","Um tipo de rede social","Um método de tradução","Um sistema para armazenar fotos"],0,"Robótica envolve criar e programar robôs."],
    ["O que é um robô?", ["Uma máquina programada para realizar tarefas","Qualquer aparelho com uma tela","Um programa que só funciona na internet","Uma máquina que sempre pensa como uma pessoa"],0,"Robôs são máquinas projetadas para executar tarefas."],
    ["Qual parte de um robô pode perceber o ambiente?", ["Sensores","Pintura","Adesivos","Rodas sem componentes"],0,"Sensores ajudam o robô a receber informações do ambiente."],
    ["Qual parte de um robô pode produzir movimento?", ["Motor ou atuador","Câmera desligada","Tela de papel","Antena sem conexão"],0,"Motores e atuadores permitem que partes do robô se movimentem."],
    ["O que é um robô industrial?", ["Um robô usado para realizar tarefas em fábricas","Um aplicativo de mensagens","Um sensor de chuva","Um tipo de computador portátil"],0,"Robôs industriais são usados em processos de fabricação."],
    ["Qual tarefa um braço robótico pode realizar numa fábrica?", ["Mover ou montar peças","Traduzir automaticamente livros","Medir a velocidade do Wi-Fi","Substituir todos os trabalhadores"],0,"Braços robóticos podem mover e montar peças."],
    ["O que faz um robô aspirador?", ["Limpa o chão seguindo comandos ou programação","Prepara qualquer tipo de alimento","Conserta a rede elétrica","Traduz conversas"],0,"Robôs aspiradores automatizam parte da limpeza do chão."],
    ["O que é um robô autônomo?", ["Um robô que realiza algumas ações sem comando humano a cada passo","Um robô que nunca usa sensores","Um robô sem programação","Um robô que funciona sem energia"],0,"Robôs autônomos usam programação e sensores para agir em certas situações."],
    ["Qual é a diferença entre um robô controlado remotamente e um autônomo?", ["O controlado recebe comandos de uma pessoa; o autônomo pode agir conforme sua programação","O controlado não tem motor; o autônomo não tem corpo","O autônomo não usa energia; o controlado usa","Não existe diferença"],0,"Um depende de comandos remotos; o outro pode executar ações programadas por conta própria."],
    ["Qual é uma função de um robô assistivo?", ["Ajudar uma pessoa em algumas tarefas","Substituir todos os profissionais de saúde","Controlar a internet da cidade","Criar dados de treinamento"],0,"Robôs assistivos podem apoiar pessoas em tarefas específicas."],
    ["Por que robôs são usados em tarefas repetitivas?", ["Podem repetir movimentos programados com consistência","Porque nunca precisam de manutenção","Porque entendem qualquer situação","Porque não precisam de supervisão"],0,"Robôs podem repetir tarefas programadas, embora ainda precisem de cuidados e manutenção."],
    ["Um robô precisa de instruções para realizar uma tarefa. Como elas são fornecidas?", ["Por meio de programação","Por meio de sentimentos","Por meio de uma fotografia impressa","Por meio de uma senha de Wi-Fi apenas"],0,"A programação define as instruções que o robô executa."],
    ["Um drone é um tipo de robô?", ["Sim, é um robô que pode voar e ser controlado ou programado","Não, porque robôs só têm rodas","Não, porque drones não usam tecnologia","Sim, mas só quando está conectado a uma televisão"],0,"Drones são robôs voadores, controlados ou programados para certas tarefas."],
    ["Por que robôs podem ser úteis em locais perigosos?", ["Podem realizar algumas tarefas reduzindo a exposição de pessoas ao perigo","Porque tornam qualquer lugar totalmente seguro","Porque não precisam ser controlados","Porque conseguem fazer qualquer tarefa"],0,"Robôs podem apoiar equipes em ambientes perigosos, mas não eliminam todos os riscos."],
    ["Robôs podem substituir todas as tarefas feitas por pessoas?", ["Não; eles são adequados para algumas tarefas e têm limitações","Sim; fazem qualquer tarefa melhor","Sim; nunca precisam de manutenção","Não; robôs não conseguem realizar tarefas"],0,"Robôs têm capacidades e limites; muitas tarefas ainda dependem de pessoas."],
    ["O que é importante para usar um robô com segurança?", ["Seguir instruções e manter as proteções necessárias","Retirar os sensores","Ignorar os avisos","Deixar qualquer pessoa alterar a programação"],0,"Regras e proteções ajudam a prevenir acidentes."],
    ["Qual destas tarefas pode ser feita por um robô de resgate?", ["Entrar em uma área perigosa para ajudar na busca","Decidir sozinho quem deve ser resgatado","Garantir que nenhum acidente aconteça","Substituir todo o trabalho da equipe"],0,"Robôs podem ajudar equipes a procurar em áreas perigosas."],
    ["Qual é a relação entre IA e robótica?", ["A IA pode ajudar um robô a interpretar informações e escolher ações","Todo sistema de IA é um robô físico","Robôs não podem usar programas","IA e robótica significam exatamente a mesma coisa"],0,"IA pode ser usada em robôs, mas também existe em programas sem corpo físico."],
    ["Qual afirmação sobre IA, IoT e robótica está correta?", ["São tecnologias diferentes que podem trabalhar juntas","Todas significam apenas robôs humanoides","IoT não usa conexão de rede","IA só existe dentro de fábricas"],0,"IA, IoT e robótica têm funções diferentes e podem ser combinadas."],
    ["Quem deve conferir o uso de tecnologias inteligentes em decisões importantes?", ["Pessoas responsáveis, junto com sistemas de apoio","Somente o dispositivo, sem nenhuma revisão","Qualquer pessoa sem conhecer o sistema","Ninguém, porque a tecnologia sempre acerta"],0,"A supervisão humana ajuda a identificar erros e usar a tecnologia com responsabilidade."]
  ].map(([q, options, answer, why]) => ({ q, options, answer, why }));

  class Level {
    constructor(def, questionQueue) {
      this.def = def; const b = new LevelBuilder(def.cols, def.rows); def.build(b); this.grid = b.grid;
      this.cols = def.cols; this.rows = def.rows; this.width = this.cols * CFG.TILE; this.height = this.rows * CFG.TILE;
      this.spawn = { x: def.spawn.c * CFG.TILE, y: def.spawn.r * CFG.TILE };
      this.quizAt = new Map(); let n = 0;
      for (let c = 0; c < this.cols; c++) for (let r = 0; r < this.rows; r++) if (this.grid[r][c] === '?') this.quizAt.set(`${c},${r}`, questionQueue[n++] || QUESTIONS[0]);
      this.enemies = (def.enemies || []).map((e, i) => ({ x: e.c * CFG.TILE, y: (this.rows - 2) * CFG.TILE - 24, w: 25, h: 24, vx: e.dir || (i % 2 ? -1 : 1), left: (e.c - 3) * CFG.TILE, right: (e.c + 3) * CFG.TILE, phase: i }));
      this.onTerminal = null;
    }
    tile(c, r) { if (r < 0 || r >= this.rows) return '.'; if (c < 0 || c >= this.cols) return '#'; return this.grid[r][c]; }
    isSolid(c, r) { return ['#','B','?','U'].includes(this.tile(c, r)); }
    onHeadBump(c, r, player) { if (this.tile(c,r) === '?') { this.grid[r][c]='U'; player.bumpedFrames=8; if(this.onTerminal)this.onTerminal(c,r,this.quizAt.get(`${c},${r}`)); } }
    touches(x,y,w,h,ch) { const T=CFG.TILE; for(let r=Math.floor(y/T);r<=Math.floor((y+h-1)/T);r++)for(let c=Math.floor(x/T);c<=Math.floor((x+w-1)/T);c++)if(this.tile(c,r)===ch)return true; return false; }
  }
  const make = (id,name,era,theme,build,enemies=[]) => ({id,name,era,theme,cols:150,rows:17,spawn:{c:3,r:12},collectibleName:'Ideias',build,enemies});
  const platformCourse = (b,shift=0) => {
    b.ground([[38+shift,41+shift],[76+shift,79+shift],[112+shift,115+shift]]);
    b.fill(14,12,17,12,'B').set(15,12,'?'); b.fill(24,10,27,10,'B'); b.fill(32,12,33,12,'B');
    b.fill(46,11,49,11,'B').set(47,11,'?'); b.fill(54,8,57,8,'B'); b.stairs(62,14,4);
    b.fill(84,11,86,11,'B'); b.fill(90,9,92,9,'B'); b.fill(96,11,98,11,'B').set(97,11,'?');
    b.fill(104,13,106,13,'#'); b.stairs(124,14,6); b.set(146,13,'G').set(146,14,'G');
  };
  const themes = [
    {bg:'#8edcf5',top:'#d9f5ff',mount:'#7ab89c',far:'#558e78',ground:'#36845c',solid:'#32794d',brick:'#f3a343',terminal:'#ffd05b',sun:'#fff0a1',accent:'#d7f2a2'},
    {bg:'#ffc28d',top:'#fff0be',mount:'#d88b63',far:'#a95649',ground:'#a9583f',solid:'#8e493a',brick:'#f3bd59',terminal:'#fff080',sun:'#fff1aa',accent:'#79d5c6'},
    {bg:'#a5d5ec',top:'#edf8ff',mount:'#7893ae',far:'#526a86',ground:'#536c73',solid:'#425a62',brick:'#82b4ca',terminal:'#ffe174',sun:'#fff8d6',accent:'#d2efff'},
    {bg:'#d6b8f2',top:'#f4e4ff',mount:'#9976ba',far:'#6b588f',ground:'#63517e',solid:'#51436e',brick:'#c294db',terminal:'#ffdc75',sun:'#fff0ae',accent:'#a9f1df'},
    {bg:'#9edc9e',top:'#e4ffc1',mount:'#76ae65',far:'#498057',ground:'#39754a',solid:'#30613f',brick:'#89be63',terminal:'#ffe374',sun:'#ffef9a',accent:'#abeddb'}
  ];
  const LEVEL_DEFS = [
    make(1,'A Casa Conectada','Sensores e privacidade',themes[0],b=>platformCourse(b),[{c:21},{c:35,dir:-1},{c:51},{c:81,dir:-1},{c:101},{c:119,dir:-1}]),
    make(2,'A Escola Inteligente','Dados com responsabilidade',themes[1],b=>{platformCourse(b,2);b.fill(20,9,23,9,'B').set(21,9,'?');b.stairs(70,14,6);b.fill(108,10,111,10,'B').set(109,10,'?');},[{c:19},{c:33,dir:-1},{c:54},{c:87,dir:-1},{c:107},{c:132,dir:-1}]),
    make(3,'Robôs que Ajudam','Saúde, tarefas e segurança',themes[2],b=>{platformCourse(b,4);b.fill(18,10,21,10,'B').set(20,10,'?');b.fill(52,11,55,11,'B').set(53,11,'?');b.stairs(74,14,7);b.fill(116,9,119,9,'B').set(117,9,'?');},[{c:24},{c:45,dir:-1},{c:71},{c:93,dir:-1},{c:113},{c:137,dir:-1}]),
    make(4,'A Cidade Conectada','Trânsito e serviços',themes[3],b=>{platformCourse(b,6);b.fill(22,8,25,8,'B').set(23,8,'?');b.fill(58,10,61,10,'B').set(59,10,'?');b.stairs(82,14,5);b.fill(122,9,125,9,'B').set(123,9,'?');},[{c:17},{c:37,dir:-1},{c:64},{c:88,dir:-1},{c:108},{c:137,dir:-1}]),
    make(5,'Missão: Tecnologia Responsável','Escolhas e consequências',themes[4],b=>{platformCourse(b,8);b.fill(16,9,19,9,'B').set(18,9,'?');b.fill(42,10,45,10,'B').set(43,10,'?');b.stairs(68,14,8);b.fill(90,8,93,8,'B').set(91,8,'?');b.fill(128,10,131,10,'B').set(129,10,'?');},[{c:20},{c:40,dir:-1},{c:60},{c:83,dir:-1},{c:105},{c:134,dir:-1}])
  ];
  window.Levels = { LEVEL_DEFS, QUESTIONS, Level, LevelBuilder };
})();
