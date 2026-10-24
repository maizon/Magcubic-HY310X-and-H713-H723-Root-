# H723 — área de pesquisa (NÃO VALIDADO)

Este repositório tem H723 no escopo de pesquisa, **não** como um dispositivo testado. A unidade HY310X examinada usa **H713 / sun50iw12p1**. Não existe relato de root ou de recuperação H723 validado aqui.

## Critérios de inclusão de nova placa

- [ ] Prova do SoC por fonte confiável no hardware, não anúncio.
- [ ] Device Tree e kernel identificados.
- [ ] Android, ABI, boot magic e partições mapeados.
- [ ] Cópias de segurança originais validadas **fora do dispositivo**.
- [ ] Método de restauração externo testado e documentado.
- [ ] Patch e teste de boot realizados **na própria placa**.
- [ ] Evidências pós-reboot (status root) e sintomas negativos publicados de forma anônima.

## Regras

**Nunca use** boot_a.img de H713 em uma placa H723 por analogia. Não supor que /system/bin/wifi, modo FEL, layout A/B, AVB ou USB flash sejam equivalentes.

Contribuições são bem-vindas via Issue/PR com logs anônimos e resultados verificáveis, sem partições privadas.
