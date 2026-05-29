# SIDI WORK — Claude Code Project Guide

## Visão Geral

Este repositório contém o trabalho do projeto SIDI. Use este arquivo para orientar o assistente Claude Code sobre convenções, fluxos e restrições do projeto.

## Stack e Tecnologias

- Descreva aqui as tecnologias principais utilizadas (ex: Python, Node.js, SQL, etc.)
- Adicione versões relevantes quando necessário

## Estrutura do Projeto

```
SIDI_WORK/
├── CLAUDE.md           # Este arquivo
├── .claude/
│   ├── settings.json   # Configurações do Claude Code
│   ├── agents/         # Definições de agentes customizados
│   ├── skills/         # Skills reutilizáveis para este projeto
│   └── rules/          # Regras e restrições específicas do projeto
```

## Convenções de Código

- Prefira editar arquivos existentes a criar novos desnecessariamente
- Sem comentários óbvios — só documente o *porquê*, nunca o *o quê*
- Sem emojis em arquivos, a menos que explicitamente solicitado

## Fluxo de Trabalho com Git

- Crie commits novos; não amende commits publicados
- Mensagens de commit em português, descritivas e no imperativo
- Não faça push sem confirmação explícita do usuário

## Restrições

- Nunca executar comandos destrutivos (rm -rf, reset --hard, etc.) sem confirmação
- Nunca expor credenciais ou segredos em arquivos rastreados pelo git
- Validar entradas apenas nas fronteiras do sistema (input do usuário, APIs externas)

## Contexto Adicional

Atualize esta seção conforme o projeto evoluir: decisões de arquitetura, integrações externas, contatos de equipe, etc.
