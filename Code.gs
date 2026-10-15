function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Controle de Férias do Time')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getVacationData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Férias");
  if (!sheet) return [];
  
  var data = sheet.getDataRange().getValues();
  data.shift(); // Remove o cabeçalho
  
  var result = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] && data[i][1]) { // Se tem nome e data
      var date = new Date(data[i][1]);
      // Formata a data para evitar problemas de fuso horário no frontend
      var formattedDate = Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd");
      result.push({
        name: data[i][0],
        startDate: formattedDate,
        days: data[i][2]
      });
    }
  }
  return result;
}

function addVacation(name, startDate, days) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Férias");
  // Converte a string YYYY-MM-DD do formulário HTML de volta para Data
  var parts = startDate.split('-');
  var dateObj = new Date(parts[0], parts[1] - 1, parts[2]); 
  
  sheet.appendRow([name, dateObj, parseInt(days)]);
  return true;
}




// ==========================================
// FUNÇÕES DE ENVIO DE E-MAIL AUTOMÁTICO
// ==========================================

function checkAndSendVacationReminders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Férias");
  if (!sheet) return;

  var data = sheet.getDataRange().getValues();
  
  // Define a data de "hoje" sem as horas para comparação exata
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calcula a data alvo (hoje + 15 dias)
  var targetDate = new Date(today);
  targetDate.setDate(today.getDate() + 15); 

  // Pula a linha de cabeçalho (i = 1)
  for (var i = 1; i < data.length; i++) {
    var name = data[i][0];
    var startDate = new Date(data[i][1]);
    var days = data[i][2];

    // Verifica se a data é válida
    if (name && startDate instanceof Date && !isNaN(startDate.valueOf())) {
      startDate.setHours(0, 0, 0, 0);

      // Se a data de início for EXATAMENTE daqui a 15 dias, envia o e-mail
      if (startDate.getTime() === targetDate.getTime()) {
        sendVacationEmail(name, startDate, days);
      }
    }
  }
}

function sendVacationEmail(name, startDate, days) {
  // E-mails dos destinatários
  var recipients = "gustavo.alexsander@voxconexao.com.br, gladyson.souza@voxconexao.com.br";
  
  // Formata a data para padrão brasileiro
  var formattedDate = Utilities.formatDate(startDate, Session.getScriptTimeZone(), "dd/MM/yyyy");
  
  var subject = "🏖️ Lembrete: Férias de " + name + " em 15 dias";

  // Template HTML bonito usando as mesmas cores do seu frontend
  var htmlBody = `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2b2d42; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 20px rgba(0,0,0,0.05);">
      
      <!-- Cabeçalho -->
      <div style="background-color: #4361ee; color: #ffffff; padding: 25px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px; font-weight: 800;">Lembrete de Férias do Time</h2>
      </div>
      
      <!-- Corpo da Mensagem -->
      <div style="padding: 30px; background-color: #f0f4f8;">
        <p style="font-size: 16px; margin-top: 0;">Olá, Liderança do CGR,</p>
        
        <p style="font-size: 16px; line-height: 1.6;">
          Passando para lembrar que, daqui a exatos <strong>15 dias</strong>, o(a) colaborador(a) <strong>${name}</strong> entrará de férias.
        </p>
        
        <!-- Cartão de Destaque -->
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 5px solid #4361ee; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <p style="margin: 5px 0; font-size: 15px;"><strong>Colaborador:</strong> ${name}</p>
          <p style="margin: 5px 0; font-size: 15px;"><strong>Início das Férias:</strong> ${formattedDate}</p>
          <p style="margin: 5px 0; font-size: 15px;"><strong>Período:</strong> ${days} dias</p>
        </div>
        
        <!-- Alerta de Ação -->
        <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; border: 1px solid #ffeeba; margin-bottom: 25px;">
          <p style="margin: 0; font-size: 15px; line-height: 1.5;">
            <strong>Ação Recomendada:</strong> Recomendamos alinhar com o(a) colaborador(a) para que o repasse de informações e responsabilidades seja feito aos demais colegas de equipe em tempo hábil.
          </p>
        </div>
        
        <!-- Rodapé -->
        <p style="font-size: 13px; color: #8d99ae; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center;">
          Este é um e-mail automático enviado pelo Sistema de Controle de Férias.<br>Por favor, não responda a esta mensagem.
        </p>
      </div>
    </div>
  `;

  // Envio usando o MailApp do Google
  MailApp.sendEmail({
    to: recipients,
    subject: subject,
    htmlBody: htmlBody
  });
}


