# Solução de problemas: sintomas observados

| Sintoma | Causa ou interpretação conhecida | Ação sem escrita |
|---|---|---|
| dd para /sdcard acusa Permission denied | UID efetivo 0 com capacidades limitadas pode não acessar a montagem FUSE do usuário shell | Usar redirecionamento do shell ADB para arquivo que o shell pode escrever, mantendo dd privilegiado somente para leitura |
| root via /system/bin/wifi informa UID 0 mas test -w falha | UID real 2000, efetivo 0; access() pode avaliar outras credenciais | Verificar CapEff e DAC; não presumir escrita autorizada |
| dd não consegue ler magisk_boot_a.img | Arquivo em /data/local/tmp não legível pelo processo | Inspecionar permissões de entrada; chmod 644 pelo proprietário (somente arquivo de backup, nunca bloco) |
| Magisk patched tem SHA igual ao original | Patch não efetivamente aplicado ou comparação inválida | Reabrir logs do Magisk, arquivo correto e conferir magic |
| boot_a SHA patched igual, Android não inicia | Imagem pode ser rejeitada por AVB/bootloader, DTB incompatível ou falha de ramdisk | Não repetir flash às cegas; usar caminho de recuperação testado |
| Tela de fastboot com desenho de cabo e celular não detecta | Não prova conexão USB Fastboot; cabo, host e porta podem ser incompatíveis | Testar método seguro, sem cabo A/A improvisado |
| USB normal fornece energia e fastboot não | Controlador pode mudar de papel, mas eletrônica externa desconhecida | Não inferir comunicação FEL/Fastboot |
| auto_update_check não aparece em env | Recurso pode existir no U-Boot compilado ou estar ausente | Não usar script sunxi_flash como teste |
| Dois arquivos de boot parecem Android! | Cabeçalho válido, mas não prova integridade completa nem slot inicializável | Comparar tamanho, hashes e compatibilidade |

## Quando parar

- Não existe backup original íntegro fora do aparelho.
- Firmware, SoC, revisão da placa ou slot divergentes.
- Modo de recuperação externa não identificado.
- Algum hash esperado não corresponde.
- Comando retorna erro de leitura/escrita ou a verificação pós-escrita diverge.

Se houver bootloop, um ZIP com imagens de partição não se restaura sozinho; o procedimento depende do bootloader e da interface de recuperação.
