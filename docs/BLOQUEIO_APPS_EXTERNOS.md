# Bloqueio de apps externos no FoCapy

O FoCapy oferece três escolhas em **Configurações → Bloqueio de apps externos**. O bloqueio é ativado somente enquanto a sessão estiver em execução. Ao **Pausar**, encerrar ou concluir a sessão, o FoCapy pede a saída do modo de bloqueio e o telefone volta ao uso normal.

## Sem bloqueio

Mantém apenas as proteções internas do FoCapy. O botão Home e outros apps continuam acessíveis.

## Fixar FoCapy (recomendado para telefone pessoal)

Usa a fixação de tela oficial do Android. Não exige reset nem administração do aparelho.

1. No Android, abra **Configurações** e pesquise por **Fixar app**, **Fixação de tela** ou *Screen pinning*.
2. Ative a fixação e, se disponível, marque a opção de pedir PIN/padrão para desafixar.
3. No FoCapy, escolha **Fixar FoCapy** em Configurações.
4. Ao iniciar uma sessão, aceite a confirmação exibida pelo Android.
5. Pause ou finalize a sessão para o FoCapy solicitar a saída. Se o Android pedir, use o gesto/PIN do sistema para desafixar.

## Quiosque gerenciado (bloqueio forte)

Bloqueia Home, recentes e a abertura normal de outros aplicativos enquanto a sessão está rodando. Só é possível em um aparelho provisionado como **Device Owner**. Isso é indicado para um aparelho dedicado ao foco.

> Atenção: a atribuição de Device Owner normalmente requer um aparelho novo ou restaurado de fábrica, sem contas configuradas. Faça backup antes. Não execute isso no seu celular principal sem entender que ele passa a ter um app administrador do dispositivo.

### Provisionamento por ADB

1. Instale o APK no aparelho recém-restaurado:

   ```bash
   adb install FoCapy-debug.apk
   ```

2. Ainda antes de adicionar contas ao aparelho, conecte-o por USB com Depuração USB ativa e execute:

   ```bash
   adb shell dpm set-device-owner com.focapy.app/.FocusDeviceAdminReceiver
   ```

3. Se o Android aceitar o comando, abra o FoCapy e selecione **Quiosque gerenciado** em Configurações.
4. Inicie uma sessão. O FoCapy libera o modo quiosque ao pausar, encerrar ou concluir a sessão.

Se o comando `dpm` recusar, o aparelho já tem conta, perfil ou proprietário configurado; será necessário restaurar e provisionar novamente. O FoCapy mostra um erro em vez de alegar que o modo quiosque foi ativado.
