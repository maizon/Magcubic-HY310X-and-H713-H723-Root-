# Como disponibilizar backups para recuperação no GitHub Pages

## O que já está publicado

O site em **/docs/index.html** e **/docs/recuperacao.html** tem inventário, parâmetros de placa, SHA-256 e análise da recuperação. O manifesto com 12 imagens de boot pode ser baixado sem autenticação. O ZIP binário **ainda não foi enviado ao GitHub**, pois o conector desta sessão não transfere o arquivo ZIP binário local para uma Release.

## Pacotes preparados

- **HY310X_H713_BOOT_Recovery_20251013.zip** (47.074.287 bytes; SHA-256 `04a7f6be27b9b80e93f572aaeca2b4ceca538cd63b893f6fd5d27271a9c60362`).
- Conteúdo: boot_a/b, vendor_boot_a/b, dtbo_a/b e vbmeta_a/b, vbmeta_system_a/b e vbmeta_vendor_a/b **originais**, não o patch Magisk.
- **backupprojeto.zip / HY310X_backup_privado_validado.zip**: arquivo **privado**, inclui metadata, private, env, misc, Reserve0, bootloader_b e outras imagens; **não publicar** sem investigação aprofundada dos dados e direitos.

## Hospedagem apropriada (se o proprietário decidir publicar o pacote reduzido)

1. Verifique primeiro se há autorização para redistribuir os binários OEM: possuir o dispositivo não concede necessariamente licença de redistribuição de firmware.
2. Faça uma auditoria para localizar identificadores/chaves e mantenha a versão *completa* apenas em armazenamento privado.
3. Abra **Releases** do repositório, clique **Draft a new release**, crie por exemplo a tag `hy310x-h713-boot-reference-20251013`.
4. Inclua explicitamente na descrição que é backup de **uma única unidade** H713 / sun50iw12p1 / tv303 / Projector.20251013.1058; **não** é firmware universal nem arquivo `update.img` para pendrive.
5. Anexe exclusivamente o ZIP reduzido revisado e os arquivos de hash, publique apenas após conferir os riscos. Não anexe `private.img`, `metadata.img`, `frp.img` ou a cópia completa.
6. O site pode apontar para o Release quando ele existir; até lá, o painel indica **manifesto público / imagens não hospedadas**.

## Conferir o pacote antes da Release

Linux/macOS:

    sha256sum HY310X_H713_BOOT_Recovery_20251013.zip

Windows PowerShell:

    Get-FileHash .\HY310X_H713_BOOT_Recovery_20251013.zip -Algorithm SHA256

O hash deve ser `04a7f6be27b9b80e93f572aaeca2b4ceca538cd63b893f6fd5d27271a9c60362`.

## Recuperação após brick

Backup por si só não garante recuperação de bootloop. É indispensável uma interface FEL, fastboot ou mecanismo OEM comprovadamente compatível. Não tente usar o ZIP como `update.img`, não desative AVB por tentativa nem grave bootloader de outro aparelho. Consulte [RECOVERY.md](RECOVERY.md).

**Aviso:** GitHub Pages não é um mecanismo de recuperação; ele serve apenas para hospedagem e documentação.

### Opção de publicação assistida no Windows (rascunho privado até publicação manual)

O repositório inclui o script [tools/publish-recovery.ps1](../tools/publish-recovery.ps1). Baixe o ZIP reduzido deste chat, instale/autentique o [GitHub CLI](https://cli.github.com/) e, a partir da pasta do repositório no PC, execute:

```powershell
.\tools\publish-recovery.ps1 -ZipPath "$HOME\Downloads\HY310X_H713_BOOT_Recovery_20251013.zip"
```

O script confere tamanho, hash e lista de 12 imagens e cria uma **Release rascunho**, sem publicação automática. Somente publique o Release após revisão de direitos de redistribuição e do risco de identificação do aparelho. Quando houver Release público com o nome e tamanho esperados, a página de recuperação detectará e exibirá seu botão de download.
