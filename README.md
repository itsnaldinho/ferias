# Controle Visual de Férias da Equipe

Um sistema web interativo e responsivo desenvolvido em Google Apps Script (HTML, CSS, JS e Google Sheets) para facilitar o planejamento e a visualização do período de férias dos colaboradores de um time[cite: 9].

O sistema elimina o controle manual em planilhas estáticas, oferecendo um calendário visual onde a equipe pode se organizar de forma orgânica[cite: 9]. Além disso, atua ativamente avisando a liderança sobre a proximidade das férias de um membro para fins de repasse de demandas[cite: 9].

## 🌟 Benefícios e Funcionalidades

* **Calendário Visual Dinâmico:** Utiliza a biblioteca *FullCalendar* para exibir o mapa anual e mensal de férias[cite: 9].
* **Legenda e Filtros Interativos:** A interface gera automaticamente uma legenda com os nomes de quem tem férias agendadas[cite: 9]. Clicar no nome de um colaborador filtra o calendário para mostrar apenas as linhas dele[cite: 9].
* **Alertas Automáticos (15 dias):** O script varre o banco de dados e envia um e-mail com layout em HTML para a liderança exatamente 15 dias antes da data de início das férias de um colaborador, sugerindo o alinhamento de repasses[cite: 9].
* **Identificação de Feriados:** Exibe de forma destacada (em preto) os feriados cadastrados, facilitando o cálculo visual de dias úteis emendados com o descanso[cite: 9].
* **UX/UI Moderna:** Design amigável e responsivo com notificações em pop-up utilizando a biblioteca *SweetAlert2*[cite: 9].

---

## 🚀 Pré-work (Como colocar o código em funcionamento)

Para ativar este sistema no seu ambiente Google, siga os passos abaixo:

### 1. Preparação da Planilha (Banco de Dados)
1. Crie uma nova Planilha no Google Sheets.
2. Renomeie a página ativa (aba) exatamente para **`Férias`** (respeitando o acento)[cite: 9].
3. Na primeira linha (cabeçalho), crie as colunas: `Nome`, `Data de Início` e `Dias`[cite: 9]. (A partir da linha 2 os dados serão salvos).

### 2. Configuração do Google Apps Script
1. Na sua planilha, clique em **Extensões > Apps Script**.
2. Crie dois arquivos no editor e cole os respectivos códigos:
   * **`Code.gs`**: Onde ficará o backend em Apps Script[cite: 9].
   * **`Index.html`**: Onde ficará o frontend (HTML/CSS/JS)[cite: 9].

### 3. Configurar o Acionador de E-mail (Gatilho/Trigger)
*Como o e-mail deve ser checado diariamente, precisamos programar o Google para rodar a função sozinho:*
1. No menu lateral esquerdo do Apps Script, clique em **Acionadores** (ícone de relógio).
2. Clique em **Adicionar acionador** (canto inferior direito).
3. Configure assim:
   * Qual função executar: **`checkAndSendVacationReminders`**[cite: 9]
   * Selecione a origem do evento: **Baseado no tempo**
   * Selecione o tipo de acionador com base no tempo: **Temporizador diário**
   * Selecione a hora do dia: **Ex: 06h às 07h**
4. Salve. Ele pedirá permissões da conta, basta aceitar.

### 4. Deploy (Implantação)
1. Clique em **Implantar > Nova implantação**.
2. Tipo: **App da Web**.
3. Executar como: **Eu** | Quem pode acessar: **Qualquer pessoa** (ou restrinja ao seu domínio empresarial).
4. Autorize e copie a URL pública gerada.

---

## 🛠️ Customização: Implementando em um Novo Ambiente / Outra Equipe

Para utilizar este sistema com outra equipe, você **deve obrigatoriamente** alterar algumas informações para que os alertas cheguem às pessoas certas e os feriados reflitam a realidade da sua região:

### No arquivo `Code.gs` (Backend):
* **Destinatários do E-mail:** Na função `sendVacationEmail()`, localize a variável `recipients` e substitua os e-mails `"gerente@dominio.com.br, supervisor@dominio.com.br"` pelos e-mails dos líderes da nova equipe[cite: 9]. Separe-os por vírgula[cite: 9].
* **Nome do Remetente/Texto:** Ainda no `sendVacationEmail()`, você pode alterar a saudação HTML `"Olá, Liderança do CGR,"` para o nome do novo setor[cite: 9].

### No arquivo `Index.html` (Frontend):
* **Feriados Nacionais e Regionais:** Localize a constante `holidays` (linha 166). É um array de datas em formato `YYYY-MM-DD`[cite: 9]. Você precisará atualizar esta lista com os feriados do ano vigente e adicionar/remover feriados municipais de onde a nova equipe opera[cite: 9].
* **Paleta de Cores dos Colaboradores:** A constante `DISTINCT_COLORS` contém uma lista de cores hexadecimais que o sistema vai distribuindo para novos colaboradores (ex: `#FF6B6B`, `#FFD93D`)[cite: 9]. Se quiser adequar à identidade visual da empresa, basta trocar esses códigos HEX[cite: 9].
* **Título da Página:** No topo do HTML e dentro do `<body>`, você pode alterar os títulos "Controle de Férias da Equipe" para o nome do seu novo time[cite: 9].
