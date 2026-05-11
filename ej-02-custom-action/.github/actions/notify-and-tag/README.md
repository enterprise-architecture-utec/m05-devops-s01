# notify-and-tag

Custom Composite Action para estandarizar el proceso de release en la organización.

## Uso

```yaml
- name: Release
  uses: ./.github/actions/notify-and-tag
  with:
    version: "1.2.3"
    environment: production
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
    create_tag: true
```

## Inputs

| Input | Requerido | Default | Descripción |
|-------|-----------|---------|-------------|
| `version` | ✅ | — | Versión semántica sin prefijo `v`. Ejemplo: `1.2.3` |
| `environment` | ❌ | `staging` | Entorno destino del release |
| `webhook_url` | ❌ | `""` | URL del webhook de notificación |
| `create_tag` | ❌ | `true` | Si debe crear el git tag |

## Outputs

| Output | Descripción |
|--------|-------------|
| `tag_name` | Nombre del tag creado. Ejemplo: `v1.2.3` |
| `release_notes` | Ruta al archivo Markdown de release notes |
| `notification_sent` | `true` si la notificación fue enviada |

## Ejemplo completo con outputs

```yaml
steps:
  - uses: actions/checkout@v4
    with:
      fetch-depth: 0    # Necesario para git log en release notes

  - name: Ejecutar release
    id: release
    uses: ./.github/actions/notify-and-tag
    with:
      version: "2.0.0"
      environment: production
      webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}

  - name: Usar los outputs
    run: |
      echo "Tag: ${{ steps.release.outputs.tag_name }}"
      echo "Notas: ${{ steps.release.outputs.release_notes }}"
```

## Qué hace internamente

```
Step 1: Validar inputs      → verifica formato semántico de versión
Step 2: Crear git tag       → git tag -a v{version} + git push
Step 3: Generar release notes → Markdown con git log desde el tag anterior
Step 4: Upload artifact     → sube las notas como artifact del run
Step 5: Enviar notificación → webhook (curl) o log si no hay webhook
Step 6: Escribir resumen    → tabla visual en $GITHUB_STEP_SUMMARY
```
