# 🚀 Deploy DriveWise com CI/CD (GitHub + Netlify)

## ✅ Pré-requisitos
- ✅ Código pronto e testado
- ✅ Build funcionando (`npm run build`)
- ✅ Conta no GitHub
- ✅ Conta no Netlify

---

## 📝 Passo a Passo Completo

### **1. Inicializar Git no Projeto**

Abra o terminal no diretório do projeto e execute:

```bash
git init
git add .
git commit -m "feat: Initial commit - DriveWise financial management app"
```

---

### **2. Criar Repositório no GitHub**

1. Acesse: https://github.com/new
2. **Repository name**: `drivewise-app` (ou o nome que preferir)
3. **Description**: "Aplicação de gestão financeira para motoristas de aplicativo"
4. **Visibility**: Private ou Public (sua escolha)
5. **NÃO marque** "Add a README file" (já temos arquivos)
6. Clique em **"Create repository"**

---

### **3. Conectar Repositório Local ao GitHub**

Copie os comandos que o GitHub mostrar (algo como):

```bash
git remote add origin https://github.com/SEU_USUARIO/drivewise-app.git
git branch -M main
git push -u origin main
```

**Substitua** `SEU_USUARIO` pelo seu username do GitHub.

---

### **4. Configurar Deploy Automático no Netlify**

#### **4.1. Acessar Netlify**
1. Acesse: https://app.netlify.com/
2. Faça login com sua conta GitHub (recomendado)

#### **4.2. Importar Projeto**
1. Clique em **"Add new site"** → **"Import an existing project"**
2. Escolha **"Deploy with GitHub"**
3. Autorize o Netlify a acessar seus repositórios
4. Selecione o repositório **`drivewise-app`**

#### **4.3. Configurar Build Settings**

O Netlify detectará automaticamente as configurações do `netlify.toml`, mas verifique:

- **Branch to deploy**: `main`
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: `20`

Clique em **"Deploy site"**

---

### **5. Aguardar Primeiro Deploy**

O Netlify vai:
1. ✅ Clonar o repositório
2. ✅ Instalar dependências (`npm install`)
3. ✅ Executar build (`npm run build`)
4. ✅ Publicar a aplicação

**Aguarde ~2-5 minutos** para o primeiro deploy.

---

### **6. Configurar Domínio Customizado (Opcional)**

Após o deploy:
1. Netlify gera um URL tipo: `https://random-name-123456.netlify.app`
2. Para customizar:
   - **Site settings** → **Domain management** → **Options** → **Edit site name**
   - Escolha: `drivewise-app.netlify.app` (ou outro disponível)

---

### **7. IMPORTANTE: Configurar Firebase Authentication**

**CRÍTICO:** Sem este passo, o login não funcionará!

1. Copie o URL do seu site no Netlify (ex: `drivewise-app.netlify.app`)
2. Acesse Firebase Console:
   - https://console.firebase.google.com/project/studio-8451728536-d17e8/authentication/settings
3. Role até **"Authorized domains"**
4. Clique em **"Add domain"**
5. Cole o domínio (SEM `https://`): `drivewise-app.netlify.app`
6. Clique em **"Add"**

---

## 🔄 Pipeline CI/CD Configurado!

Agora, **toda vez que você fizer um commit e push**:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push
```

O Netlify automaticamente:
1. ✅ Detecta o push
2. ✅ Executa `npm install`
3. ✅ Executa `npm run build`
4. ✅ Faz deploy da nova versão
5. ✅ Notifica você por email

---

## 📱 Acessar no Celular

1. Abra o URL do Netlify no navegador do celular
2. Para adicionar à tela inicial:
   - **Android (Chrome)**: Menu → "Adicionar à tela inicial"
   - **iOS (Safari)**: Compartilhar → "Adicionar à Tela de Início"

---

## 🔍 Monitorar Deploys

- **Dashboard Netlify**: https://app.netlify.com/sites/SEU_SITE/deploys
- Ver logs de build
- Rollback para versões anteriores
- Configurar notificações

---

## 🐛 Troubleshooting

### Build falhou no Netlify
- Verifique os logs no dashboard
- Certifique-se que `npm run build` funciona localmente
- Verifique se todas as dependências estão no `package.json`

### Login não funciona
- Verifique se adicionou o domínio aos "Authorized domains" do Firebase
- Aguarde 1-2 minutos após adicionar o domínio

### App não carrega dados
- Verifique se as Firestore Rules estão publicadas
- Confirme que o Firebase está configurado corretamente

---

## 🎉 Pronto!

Sua aplicação está:
- ✅ No ar e acessível de qualquer lugar
- ✅ Com deploy automático a cada push
- ✅ Com HTTPS habilitado automaticamente
- ✅ Pronta para uso no celular

**URL do seu site**: https://SEU_SITE.netlify.app

---

## 📚 Próximos Passos (Opcional)

- [ ] Configurar domínio próprio (ex: `meuapp.com.br`)
- [ ] Adicionar proteção de branch no GitHub
- [ ] Configurar ambientes de staging/produção
- [ ] Adicionar testes automatizados no CI/CD
- [ ] Configurar PWA para funcionar offline

---

**Dúvidas?** Consulte:
- Netlify Docs: https://docs.netlify.com/
- Firebase Docs: https://firebase.google.com/docs
