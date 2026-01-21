# 🚀 Guia de Deploy - DriveWise no Netlify

## ✅ Pré-requisitos Completos

Sua aplicação já está configurada corretamente:
- ✅ Firebase/Firestore configurado
- ✅ Next.js 15.3.3
- ✅ Arquivo `netlify.toml` criado
- ✅ Configurações prontas para produção

---

## 📝 Passo a Passo para Deploy

### **1. Criar Conta no Netlify** (se ainda não tiver)

1. Acesse: https://www.netlify.com/
2. Clique em **"Sign up"**
3. Escolha **"Sign up with GitHub"** (recomendado)

---

### **2. Preparar o Repositório Git**

Se ainda não subiu o código para o GitHub:

```bash
# Inicializar Git (se ainda não fez)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Preparar para deploy no Netlify"

# Criar repositório no GitHub e seguir instruções para push
```

**OU use a opção "Deploy manual" do Netlify (mais simples)**

---

### **3. Deploy no Netlify - OPÇÃO A: Com GitHub (Recomendado)**

1. **No Netlify Dashboard**, clique em **"Add new site"** → **"Import an existing project"**
2. Escolha **"GitHub"**
3. Autorize o Netlify a acessar seus repositórios
4. Selecione o repositório `studio`
5. Configurações de build (já estão no `netlify.toml`):
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Clique em **"Deploy site"**

---

### **3. Deploy no Netlify - OPÇÃO B: Deploy Manual (Mais Rápido)**

1. **No Netlify Dashboard**, clique em **"Add new site"** → **"Deploy manually"**
2. No seu computador, execute:
   ```bash
   npm run build
   ```
3. Arraste a pasta `.next` para a área de drop do Netlify
4. Aguarde o upload e deploy

---

### **4. Configurar Domínio (Opcional)**

Após o deploy:
1. Netlify gera um URL tipo: `https://random-name-123456.netlify.app`
2. Você pode customizar em **"Site settings"** → **"Domain management"** → **"Options"** → **"Edit site name"**
3. Escolha algo como: `drivewise-app.netlify.app`

---

### **5. Testar no Celular**

1. Copie o URL do Netlify
2. Abra no navegador do celular
3. Para adicionar à tela inicial:
   - **Android Chrome**: Menu → "Adicionar à tela inicial"
   - **iOS Safari**: Compartilhar → "Adicionar à Tela de Início"

---

## 🔒 Segurança do Firebase

**IMPORTANTE**: Suas credenciais do Firebase já estão no código (`config.ts`). Isso é normal para aplicações web, pois:
- ✅ As **Firestore Rules** protegem seus dados
- ✅ Apenas usuários autenticados podem acessar seus dados
- ✅ Cada usuário só vê seus próprios registros

**Verifique suas Firestore Rules** em:
`https://console.firebase.google.com/project/studio-8451728536-d17e8/firestore/rules`

---

## 📱 Progressive Web App (PWA)

Sua aplicação já tem suporte PWA graças ao `manifest.json`! 
Ao adicionar à tela inicial, ela funciona como um app nativo.

---

## 🐛 Problemas Comuns

### Erro de Build no Netlify
- Verifique se `package.json` está correto
- Certifique-se que `npm run build` funciona localmente primeiro

### App não carrega dados
- Verifique as Firestore Rules
- Confirme que o Firebase está configurado corretamente

### Não consigo fazer login
- Verifique se adicionou o domínio do Netlify aos domínios autorizados do Firebase:
  1. Firebase Console → Authentication → Settings → Authorized domains
  2. Adicione: `seu-site.netlify.app`

---

## ✅ Checklist Final

- [ ] Código commitado no Git (se usar GitHub)
- [ ] `npm run build` executa sem erros
- [ ] Deploy realizado no Netlify
- [ ] Site acessível pelo URL gerado
- [ ] Login funciona
- [ ] Dados carregam corretamente
- [ ] Testado no celular
- [ ] Adicionado à tela inicial do celular

---

## 🎉 Pronto!

Sua aplicação DriveWise está no ar e acessível de qualquer lugar! 🚀
