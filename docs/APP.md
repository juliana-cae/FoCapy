# Focapy

Focapy é um aplicativo de foco baseado em Pomodoro. Cada sessão concluída transforma tempo de atenção em vegetação colecionável e ajuda a construir uma paisagem mensal.

## Navegação

- **Foco**: configura e executa a sessão Pomodoro.
- **Inventário**: mostra as 20 vegetações disponíveis, quantidades conquistadas e controles para desativar/ativar itens.
- **Jardins**: calendário histórico dos jardins mensais, incluindo o jardim atual e os jardins arquivados.
- **Ritmo**: acompanha a meta diária, sessões recentes, frases motivacionais e registros de Compromisso.

## Sessão Pomodoro

O usuário escolhe uma duração entre 25, 45, 60 ou 90 minutos, define uma intenção e inicia o foco. A sessão pode ser pausada ou recomeçada.

Ao concluir:

1. o tempo é contabilizado;
2. uma vegetação é adicionada ao inventário local;
3. a raridade é influenciada pela duração da sessão;
4. a paisagem do mês recebe uma representação da conquista;
5. o evento aparece no histórico.

## Modo estrito

O **Modo estrito** desencoraja o abandono acidental de uma sessão em andamento. Quando o usuário tenta recomeçar enquanto uma sessão está rodando, o app pede confirmação antes de descartar o progresso.

O modo não bloqueia o sistema operacional, não impede fechar o app e não apaga sessões já concluídas. Ele é uma proteção de intenção, não uma restrição coercitiva.

## Som ambiente

O **Som ambiente** gera um tom contínuo e suave diretamente no aparelho usando a Web Audio API. O status visível indica:

- **desligado**: nenhum áudio ativo;
- **ativo**: o contexto de áudio foi criado e iniciado;
- **indisponível neste aparelho**: o WebView não oferece AudioContext.

O áudio começa quando uma sessão é iniciada, é interrompido ao pausar, recomeçar ou concluir a sessão e pode ser desligado pelo usuário.

## Inventário

O inventário é persistido localmente no aparelho. A quantidade de itens não tem limite máximo.

Cada item possui um botão:

- **Desativar**: mantém a conquista e a quantidade, mas retira o item da paisagem mensal;
- **Ativar**: permite que o item volte a aparecer na paisagem.

Desativar não é excluir.

## Modo dev

O Modo dev fica nas configurações. Ele permite adicionar itens e simular sessões sem alterar permanentemente o estado real.

Ao ativar o modo, o app cria um snapshot. Ao desativar, restaura inventário, sessões, posição e itens ativados/desativados anteriores. Os dados de teste não devem contaminar o armazenamento normal.

## Paisagem mensal

A paisagem inicial representa somente as conquistas ativas do mês corrente. Ela não exibe a data na cena principal.

Na mudança de mês, as conquistas e sessões anteriores são arquivadas como **Compromisso**. O jardim mensal anterior pode ser acessado pela sessão **Jardins**, através do calendário.

## Compromisso e Jardins

Cada registro mensal arquivado contém:

- mês e ano;
- quantidade de sessões;
- vegetações conquistadas e suas quantidades;
- título **Compromisso**.

A tela Jardins permite selecionar um mês e visualizar suas conquistas sem alterar o inventário atual.

## Persistência e privacidade

Os dados de foco, inventário, configurações, itens desativados e jardins ficam no armazenamento local do aplicativo. O app não exige uma conta para funcionar.

## Idioma

O idioma pode ser alterado em **Configurações → Idioma**. A escolha é persistida localmente. A interface oferece Português (Brasil) e English.
## Conexão com GitHub

A conexão com GitHub é uma etapa separada de desenvolvimento. Ela pode ser usada para versionar o código, abrir issues ou publicar o projeto, mas exige autorização explícita do usuário no GitHub. Tokens, senhas e códigos de autenticação não devem ser enviados ao assistente.
