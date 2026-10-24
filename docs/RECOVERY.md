# Backup e recuperação: do que há evidência

> **Atenção:** salvar um boot.img não garante que ele poderá ser restaurado se o Android não iniciar. Tenha um método de recuperação independente *realmente testado* antes de qualquer flash.

## 1. O conjunto recebido (caso HY310X H713)

**21 imagens válidas**, aproximadamente **339.738.624 bytes** descompactados. Referência anônima em [reference/h713-hy310x-20251024.json](../reference/h713-hy310x-20251024.json).

**Ausentes:** bootloader_a (32 MiB) e frp (512 KiB), falharam com Permission denied.  
**Intencionalmente excluídas:** super, userdata/UDISK, media_data e mmcblk0 inteiro.  
**Não é dump completo de firmware**: não inclui system/vendor/product em super e não é um update.img IMAGEWTY.

### Verificação offline (nenhuma modificação no dispositivo)

    python3 tools/backup_audit.py /caminho/backupprojeto.zip --reference reference/h713-hy310x-20251024.json
    python3 tools/validate_boot.py --original /pasta/boot_a.img --patched /pasta/magisk_patched.img

Para extrair **em ambiente privado**:

    python3 tools/backup_audit.py /caminho/backupprojeto.zip --extract /pasta/privada --reference reference/h713-hy310x-20251024.json

Em Windows, use py -3 no lugar de python3. A ferramenta rejeita nomes inesperados, arquivos grandes demais e ZIP com caminhos relativos maliciosos.

## 2. Estratégia recomendada

1. Inventariar SoC, placa, slot, firmware e controlador USB.
2. Copiar imagens originais para duas mídias físicas. Gerar checksums e verificar **as cópias fora do projetor**.
3. Identificar firmware original **da mesma placa/revisão** e possibilidade de recuperação *sem Android*.
4. Provar acesso de recuperação (fastboot/FEL/USB updater) **sem executar gravações**.
5. Só então considerar alterações na partição de boot.
6. Se ocorrer falha e o Android ainda estiver ativo, conservar energia e conexão; não reiniciar antes de avaliar recuperação.

## 3. Matriz de recuperação

| Estado | O que pode ser tentado | Condição |
|---|---|---|
| Android inicia e ADB funciona | Comparação SHA, reverter boot da própria unidade | Acesso legítimo à partição, backup original confirmado |
| Android não inicia mas fastboot é acessível | Consulta de informações; eventual restauração | Cabo de dados, bootloader que aceite operação, teste prévio |
| Bootloader acessível por FEL | Procedimento compatível com placa | Ferramentas FEL/PC + firmware e método comprovados |
| U-Boot oferece atualização por pendrive | Pacote oficial IMAGEWTY compatível | Atualizador realmente presente, anti-rollback conhecido |
| Nenhuma interface externa | Recuperação indeterminada | Pode exigir abertura e suporte técnico |

**Não gravar** env, private, metadata, misc, frp ou bootloader de outro dispositivo. Podem conter parâmetros/calibração/segredos exclusivos.

## 4. USB pendrive não é boot temporário comprovado

O comando sunxi_flash write update/update.img firmware, citado em outros modelos H713, **grava firmware**. Não execute com magisk_patched.img renomeado nem use pacote de outro modelo. Veja [USB, FEL e Boot](USB-BOOT-AND-FEL.md).

## 5. Importância dos hashes

O hash de boot_a após a gravação só comprova **conteúdo gravado**, não aceitação do Android Verified Boot, inicialização funcional nem integridade das outras partições. Nunca chame um teste de hash de prova de ausência de risco de brick.

## 6. Privacidade e redistribuição

private.img, metadata.img, env e misc podem conter informação sensível. Backups de firmware OEM podem incluir material protegido por direitos autorais. Este repositório publica **documentação, ferramentas e inventário sanitizado**, não imagens de aparelhos.

## 7. Página web da recuperação

Consulte [Central de recuperação](recuperacao.html) para comparar imagens, baixar hashes públicos e verificar localmente o SHA-256 do ZIP reduzido. **A página não hospeda partições privadas nem executa flash.** Para colocar o pacote reduzido no GitHub Releases após revisão de direitos/licenças, siga [PUBLISH-BACKUPS.md](PUBLISH-BACKUPS.md).
