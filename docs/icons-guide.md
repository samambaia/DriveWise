# Ícones do DriveWise

## Arquivos de Ícones

O projeto agora inclui ícones personalizados para o DriveWise:

### Arquivos SVG (Vetoriais)
- `public/icon.svg` - Ícone principal SVG de alta qualidade (512x512)

### Arquivos PNG (Ráster) - A SEREM CRIADOS
- `public/icon-192x192.png` - Para PWA e Android (192x192)
- `public/icon-512x512.png` - Para iOS e alta qualidade (512x512)
- `public/apple-icon.png` - Para iOS home screen

---

## 🎨 Como Gerar os Ícones PNG

Como o SVG já está criado em `public/icon.svg`, você precisa converter para PNG nos tamanhos corretos. Use uma das opções abaixo:

### Opção 1 - Online (Mais Fácil)
1. Acesse: https://cloudconvert.com/svg-to-png
2. Faça upload do arquivo `public/icon.svg`
3. Defina o tamanho para 512x512px
4. Clique em "Convert"
5. Baixe o PNG resultante e salve como `public/icon-512x512.png`
6. Repita o processo para 192x192px e salve como `public/icon-192x192.png`

### Opção 2 - Figma (Designers)
1. Abra o arquivo `public/icon.svg` no Figma
2. Use "File" > "Export"
3. Selecione PNG
4. Exporte nos tamanhos: 192x192 e 512x512

### Opção 3 - PowerShell no Windows (Automático)

```powershell
# Instala magick se não tiver
# winget install ImageMagick

# Gera os ícones PNG a partir do SVG
magick public/icon.svg -resize 192x192 public/icon-192x192.png
magick public/icon.svg -resize 512x512 public/icon-512x512.png
magick public/icon.svg -resize 180x180 public/apple-icon.png
```

### Opção 4 - Linux/Mac Terminal
```bash
# Instala ImageMagick se não tiver
# brew install imagemagick  # Mac
# sudo apt install imagemagick  # Ubuntu

# Gera os ícones PNG a partir do SVG
convert public/icon.svg -resize 192x192 public/icon-192x192.png
convert public/icon.svg -resize 512x512 public/icon-512x512.png
convert public/icon.svg -resize 180x180 public/apple-icon.png
```

---

## 📱 Onde os Ícones São Usados

### No App Web (Browser)
- **Favicon**: `icon.svg` (referenciado em `layout.tsx`)
- **Manifest PWA**: `/icon.svg`, `/icon-192x192.png`, `/icon-512x512.png`

### No Código React
- **Componente**: `DriveWiseIcon` (importado de `@/components/DriveWiseLogo`)
- **Login Screen**: Logo com gradiente
- **Header**: Ícone principal
- **Bottom Navigation**: Ícone da aba Principal

---

## 🎨 Design do Ícone

O ícone representa:
- **Carro**: Motorista de aplicativo
- **Cifrão ($)**: Controle financeiro
- **Arco de progresso**: Metas e objetivos
- **Gradiente Teal**: Identidade visual Material Design 3

### Cores
- Background: Teal gradient (#00897B → #00695C)
- Carro: Branco com 95% de opacidade
- Rodas: Teal sólido
- Destaques: Amber gradient (#FFA000 → #FF8F00)
- Texto: Branco

---

## 🔄 Após Gerar os PNGs

1. Coloque os arquivos PNG em `public/`
2. Remova o cache: `rm -rf .next`
3. Execute o app: `npm run dev`
4. Teste no navegador e no dispositivo

---

## ✨ Ferramentas Recomendadas

### Conversão SVG → PNG
- https://cloudconvert.com/svg-to-png (Online)
- ImageMagick (CLI)
- Figma (Design)
- Adobe Illustrator (Design)

### Teste de PWA
- https://pwa-builder.pwabuilder.com/
- Chrome DevTools > Application > Manifest

---

## 📝 Notas Importantes

- Mantenha o ícone SVG de alta qualidade para escalabilidade
- Os PNGs são necessários para melhor compatibilidade com dispositivos
- O ícone SVG deve ser usado sempre que possível (web, favicon)
- O ícone deve funcionar bem em fundo claro e escuro
- Considere adicionar um splash screen para carregamento inicial do app
