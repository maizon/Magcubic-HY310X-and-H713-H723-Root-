<div align="center">

# 🔬 Maizon Projector Research Lab
### HY310X · Allwinner H713 / H723 · Android TV Projectors

**Documentação independente de root, boot, segurança e recuperação — baseada em evidências.**

![status](https://img.shields.io/badge/H713%20HY310X-root%20relatado%20funcional-22c55e)
![backup](https://img.shields.io/badge/backup-21%20parti%C3%A7%C3%B5es%20verificadas-2563eb)
![recovery](https://img.shields.io/badge/recupera%C3%A7%C3%A3o%20externa-n%C3%A3o%20validada-f59e0b)
![H723](https://img.shields.io/badge/H723-n%C3%A3o%20testado-64748b)

**[🖥️ Dashboard de pesquisa](docs/index.html) · [📘 Caso real HY310X](docs/HY310X-LAB-NOTES.md) · [🛡️ Recuperação](docs/RECOVERY.md) · [🧪 Ferramentas](tools/README.md)**

</div>

> **Estado verificado:** um projetor apresentado como HY310X iniciou normalmente após receber Magisk 30.7 no slot A, conforme relato do proprietário em 24/10/2026. O hardware reportou **Allwinner H713**, não H723. Não extrapolar o resultado para outros modelos/firmwares.

## Comece aqui

| Quero… | Caminho |
|---|---|
| Descobrir o SoC e a partição correta | [Identificação segura](docs/COMPATIBILITY.md) |
| Entender o root reproduzido | [Caderno de laboratório HY310X](docs/HY310X-LAB-NOTES.md) |
| Fazer backups e validar hashes | [Guia de backup e restauração](docs/RECOVERY.md) + [auditoria offline](tools/README.md) |
| Analisar USB, FEL, fastboot e pendrive | [Mapa de métodos USB](docs/USB-BOOT-AND-FEL.md) |
| Conferir riscos AVB e arquivos privados | [Segurança](SECURITY.md) |
| Descobrir referências técnicas | [Fontes e créditos](docs/SOURCES.md) |
| Usar o painel visual | [Abrir dashboard](docs/index.html) — habilitar GitHub Pages em main /docs |

## Caso de laboratório: H713 identificado em unidade HY310X

| Evidência | Resultado |
|---|---|
| Chip / board | **sun50iw12p1**, **allwinner,tv303** |
| Android / Kernel | 11, Linux **5.4.99**, usuários **ARMv7 (32-bit)** |
| Build observada | **Projector.20251013.1058** |
| Boot original | **64 MiB**, cabeçalho ANDROID! |
| Root preliminar | **/system/bin/wifi**: UID efetivo 0, sem capacidades efetivas |
| Boot ativo | **boot_a**, slot **_a** |
| Magisk | **30.7**, patch gerado no próprio projetor |
| Gravação | **64 MiB** escritos e hash pós-escrita confirmado |
| Após reboot | **root relatado como funcionando** pelo proprietário |
| Backup de laboratório | **21 imagens** validadas; **bootloader_a e frp indisponíveis** |
| Restauração externa | **NÃO comprovada** para esta placa |

**O sucesso de um flash não comprova que um segundo aparelho pode ser recuperado após bootloop.** Fastboot USB, FEL e atualizador via pendrive dependem da placa e do firmware exatos.

## Organização

- **docs/** — dashboard visual, ficha técnica, compatibilidade H713/H723, USB/FEL, recuperação, fontes e limitações.
- **tools/** — verificadores **offline/read-only** de backups e boot, inventário ADB que não grava partições.
- **reference/** — inventário público **sem imagens proprietárias, chaves, números de série nem partições privadas**.
- **tests/** e **.github/workflows/** — testes automatizados sem hardware.
- **SECURITY.md** — política de não publicar partições sensíveis ou backups completos.

### Backups: por que não estão neste GitHub público?

O arquivo enviado pelo proprietário continha **21 imagens reais (aprox. 324 MiB descompactados)**, incluindo **private**, **metadata**, **env**, **misc** e bootloader. Essas partições podem revelar segredos, configurações e identificadores exclusivos do dispositivo, além de código OEM proprietário. **Não republicamos binários brutos em um repositório público.** O kit completo, verificado e organizado é entregue separadamente ao dono, para guarda privada. Contribuidores devem enviar relatórios **redigidos/anônimos**, não dumps.

## Princípios do laboratório

**Evidência > marketing.** Um nome comercial HY310X/HY300/H723 não prova qual SoC está instalado.  
**Leitura antes de escrita.** Scripts publicados não alteram partições automaticamente.  
**Nunca prometer anti-brick.** Backup não é restauração sem um método externo testado.  
**Créditos explícitos.** Este repositório documenta um caso próprio e referencia projetos de pesquisa independentes — não os representa oficialmente.

**Projeto comunitário Maizon**, sem vínculo com Allwinner, Magcubic, Google, Magisk ou fabricantes. Procedimentos podem inutilizar o aparelho. Use apenas em dispositivos de sua propriedade.
