import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { BlogPost } from '@/lib/blog-types'

const BLOG_FILE = path.join(process.cwd(), 'data', 'blog.json')

const defaultPosts: BlogPost[] = [
  {
    id: '10-dicas-economizar-frete',
    title: '10 Dicas Infalíveis para Economizar no Frete Internacional',
    slug: '10-dicas-economizar-frete',
    excerpt: 'Descubra estratégias comprovadas para reduzir drasticamente os custos de frete na sua importação dos EUA.',
    content: `# 10 Dicas Infalíveis para Economizar no Frete Internacional

Importar produtos dos Estados Unidos pode ser uma excelente forma de economizar e ter acesso a produtos únicos. No entanto, o frete internacional pode representar uma parcela significativa do custo total. Aqui estão 10 dicas comprovadas para economizar no frete:

## 1. Consolide Seus Pacotes
A consolidação é uma das estratégias mais eficazes para economizar. Em vez de enviar vários pacotes separados, aguarde e envie tudo junto. Isso reduz o custo por item e maximiza o espaço da caixa.

## 2. Escolha o Peso Ideal
Muitas transportadoras têm faixas de peso com preços mais vantajosos. Conheça essas faixas e tente ficar dentro delas. Por exemplo, se você está em 2,1kg, talvez valha a pena adicionar um item leve para chegar a 2,5kg e pagar menos por kg.

## 3. Compare Transportadoras
Não se limite a uma única transportadora. Compare preços entre diferentes opções como DHL, FedEx, UPS e transportadoras nacionais. Cada uma tem suas vantagens dependendo do peso e destino.

## 4. Use Endereços de Entrega Estratégicos
Alguns estados têm taxas de frete mais baixas. Considere usar endereços em estados como Delaware, Oregon ou New Hampshire, que não têm imposto sobre vendas.

## 5. Aproveite Promoções e Cupons
Muitas lojas americanas oferecem frete grátis para compras acima de determinado valor. Planeje suas compras para atingir esses valores e economize no frete.

## 6. Evite Produtos Proibidos
Produtos como líquidos, baterias e itens frágeis podem ter restrições ou custos adicionais. Verifique sempre as políticas antes de comprar.

## 7. Use Serviços de Consolidação
Serviços como o da Euaconecta permitem que você receba vários pacotes em um endereço americano e depois os consolide em uma única remessa.

## 8. Planeje com Antecedência
Compras de última hora geralmente custam mais caro. Planeje suas compras com antecedência para aproveitar promoções e frete mais barato.

## 9. Monitore Taxas de Câmbio
O valor do dólar pode impactar significativamente o custo total. Monitore as taxas e compre quando estiver favorável.

## 10. Use Ferramentas de Comparação
Utilize ferramentas online para comparar preços de frete entre diferentes transportadoras e encontrar a melhor opção para seu caso.

## Conclusão
Economizar no frete internacional é possível com planejamento e estratégia. Implemente essas dicas e veja a diferença no seu bolso!`,
    author: 'Equipe Euaconecta',
    category: 'economia-frete',
    tags: ['frete', 'economia', 'importação', 'dicas'],
    featuredImage: '/images/blog/frete-economia.jpg',
    status: 'published',
    isFeatured: true,
    views: 0,
    likes: 0,
    publishedAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    seoTitle: '10 Dicas para Economizar no Frete Internacional - Euaconecta',
    seoDescription: 'Aprenda como reduzir custos de frete na importação dos EUA com estratégias comprovadas. Dicas práticas para economizar.',
    seoKeywords: ['frete internacional', 'economia importação', 'dicas frete', 'importar EUA']
  },
  {
    id: 'melhores-lojas-americanas-2024',
    title: 'As 15 Melhores Lojas Americanas para Comprar em 2024',
    slug: 'melhores-lojas-americanas-2024',
    excerpt: 'Guia completo das melhores lojas americanas organizadas por categoria. Descubra onde encontrar os melhores preços e produtos.',
    content: `# As 15 Melhores Lojas Americanas para Comprar em 2024

Comprar nos Estados Unidos pode ser uma excelente forma de economizar e ter acesso a produtos únicos. Aqui está nosso guia das melhores lojas americanas organizadas por categoria:

## 🛍️ **Moda e Acessórios**

### 1. **Nike**
- **Especialidade**: Calçados e roupas esportivas
- **Vantagens**: Lançamentos exclusivos, promoções frequentes
- **Dica**: Aproveite as promoções de fim de temporada

### 2. **Adidas**
- **Especialidade**: Esportes e lifestyle
- **Vantagens**: Preços competitivos, variedade de produtos
- **Dica**: Cadastre-se para receber ofertas exclusivas

### 3. **Zara**
- **Especialidade**: Moda rápida e tendências
- **Vantagens**: Preços acessíveis, coleções atualizadas
- **Dica**: Acompanhe as novas coleções semanalmente

## 💻 **Eletrônicos e Tecnologia**

### 4. **Apple Store**
- **Especialidade**: Produtos Apple
- **Vantagens**: Lançamentos primeiro, garantia internacional
- **Dica**: Aproveite os programas de troca

### 5. **Best Buy**
- **Especialidade**: Eletrônicos em geral
- **Vantagens**: Preços competitivos, garantia estendida
- **Dica**: Compare preços online vs loja física

### 6. **Amazon**
- **Especialidade**: Tudo em um lugar
- **Vantagens**: Maior variedade, Prime com frete grátis
- **Dica**: Use o Prime para economizar no frete

## 🏠 **Casa e Decoração**

### 7. **Target**
- **Especialidade**: Casa, moda e eletrônicos
- **Vantagens**: Preços acessíveis, qualidade boa
- **Dica**: Aproveite as promoções sazonais

### 8. **Home Depot**
- **Especialidade**: Ferramentas e materiais de construção
- **Vantagens**: Qualidade profissional, preços competitivos
- **Dica**: Compare com outras lojas de ferramentas

### 9. **Bed Bath & Beyond**
- **Especialidade**: Casa e cama
- **Vantagens**: Cupons de desconto, qualidade premium
- **Dica**: Cadastre-se para receber cupons

## 🎮 **Entretenimento e Hobbies**

### 10. **GameStop**
- **Especialidade**: Jogos e consoles
- **Vantagens**: Lançamentos primeiro, trade-in
- **Dica**: Aproveite os programas de fidelidade

### 11. **Barnes & Noble**
- **Especialidade**: Livros e entretenimento
- **Vantagens**: Membros têm descontos exclusivos
- **Dica**: Aproveite as promoções de livros

## 🏃‍♀️ **Saúde e Fitness**

### 12. **GNC**
- **Especialidade**: Suplementos e saúde
- **Vantagens**: Produtos de qualidade, consultoria
- **Dica**: Aproveite os programas de fidelidade

### 13. **Dick's Sporting Goods**
- **Especialidade**: Esportes e fitness
- **Vantagens**: Variedade, qualidade, preços bons
- **Dica**: Compare preços online vs loja

## 🛒 **Marketplace e Variedades**

### 14. **Walmart**
- **Especialidade**: Tudo em um lugar
- **Vantagens**: Preços baixos, variedade
- **Dica**: Aproveite o Walmart+ para frete grátis

### 15. **Costco**
- **Especialidade**: Atacado e variedades
- **Vantagens**: Preços por atacado, qualidade
- **Dica**: Ideal para compras em grande quantidade

## 💡 **Dicas Gerais para Comprar**

### **Antes de Comprar:**
1. **Compare preços** entre diferentes lojas
2. **Verifique promoções** e cupons disponíveis
3. **Leia reviews** dos produtos
4. **Confirme a política de devolução**

### **Durante a Compra:**
1. **Use cupons** e códigos promocionais
2. **Aproveite frete grátis** quando disponível
3. **Cadastre-se** para receber ofertas
4. **Verifique impostos** estaduais

### **Após a Compra:**
1. **Acompanhe o envio** pelo tracking
2. **Guarde os recibos** para garantia
3. **Teste os produtos** rapidamente
4. **Avalie a experiência** para futuras compras

## 🎯 **Conclusão**

Cada loja tem suas vantagens específicas. A chave é conhecer o que cada uma oferece de melhor e usar isso a seu favor. Com planejamento e estratégia, você pode economizar significativamente e ter acesso a produtos únicos.

**Dica Final**: Use serviços de consolidação como o da Euaconecta para comprar em várias lojas e enviar tudo junto, economizando no frete!`,
    author: 'Equipe Euaconecta',
    category: 'guias-compras',
    tags: ['lojas americanas', 'compras', 'guia', 'melhores lojas'],
    featuredImage: '/images/blog/lojas-americanas.jpg',
    status: 'published',
    isFeatured: true,
    views: 0,
    likes: 0,
    publishedAt: '2024-01-20T10:00:00Z',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    seoTitle: '15 Melhores Lojas Americanas para Comprar em 2024 - Euaconecta',
    seoDescription: 'Descubra as melhores lojas americanas organizadas por categoria. Guia completo com dicas para economizar nas compras.',
    seoKeywords: ['lojas americanas', 'comprar EUA', 'melhores lojas', 'guia compras']
  },
  {
    id: 'primeira-importacao-guia-completo',
    title: 'Guia Completo: Sua Primeira Importação dos EUA',
    slug: 'primeira-importacao-guia-completo',
    excerpt: 'Passo a passo completo para fazer sua primeira importação dos Estados Unidos sem erros e com máxima economia.',
    content: `# Guia Completo: Sua Primeira Importação dos EUA

Importar dos Estados Unidos pode parecer complicado no início, mas com o guia certo, você pode fazer sua primeira importação com sucesso. Aqui está tudo que você precisa saber:

## 📋 **Pré-Importação: Planejamento**

### **1. Defina Seu Orçamento**
- Estabeleça um valor máximo para gastar
- Inclua frete, impostos e taxas na conta
- Reserve 20% a mais para imprevistos

### **2. Escolha os Produtos**
- Comece com itens de baixo valor
- Evite produtos proibidos ou restritos
- Verifique se o produto é permitido no Brasil

### **3. Pesquise Preços**
- Compare preços entre diferentes lojas
- Verifique se compensa importar vs comprar no Brasil
- Considere o custo total (produto + frete + impostos)

## 🛒 **Durante a Compra**

### **1. Escolha a Loja**
- Prefira lojas confiáveis e conhecidas
- Verifique políticas de devolução
- Confirme se enviam para o Brasil

### **2. Cadastro e Conta**
- Crie uma conta na loja
- Use um endereço americano (serviço de redirecionamento)
- Cadastre um cartão internacional

### **3. Finalização da Compra**
- Verifique todos os dados antes de confirmar
- Use cupons e promoções disponíveis
- Confirme o endereço de entrega

## 📦 **Processo de Envio**

### **1. Acompanhamento**
- Receba o número de rastreamento
- Acompanhe o envio até o endereço americano
- Confirme o recebimento

### **2. Consolidação (Opcional)**
- Se comprou em várias lojas, consolide os pacotes
- Economize no frete internacional
- Reduza o risco de perda

### **3. Envio para o Brasil**
- Escolha a transportadora
- Compare preços e prazos
- Preencha a declaração de conteúdo

## 💰 **Custos e Impostos**

### **Impostos de Importação**
- **Até $50**: Isento de impostos
- **$50 a $100**: 60% de imposto sobre o valor excedente
- **Acima de $100**: 60% sobre o valor total

### **ICMS Estadual**
- Varia de estado para estado
- Geralmente entre 17% a 25%
- Verifique a alíquota do seu estado

### **Taxas Adicionais**
- Taxa de desembaraço aduaneiro
- Taxa de armazenagem (se houver atraso)
- Taxa de entrega domiciliar

## 📋 **Documentação Necessária**

### **Para a Compra:**
- Cartão de crédito internacional
- Endereço americano válido
- Dados pessoais completos

### **Para o Envio:**
- CPF
- RG ou CNH
- Comprovante de endereço
- Declaração de conteúdo

## ⚠️ **Produtos Proibidos e Restritos**

### **Proibidos:**
- Armas e munições
- Drogas e medicamentos controlados
- Produtos falsificados
- Alimentos perecíveis

### **Restritos:**
- Eletrônicos (podem precisar de certificação)
- Cosméticos (devem ter registro na Anvisa)
- Suplementos (verificar regulamentação)
- Brinquedos (certificação do Inmetro)

## 🚚 **Transportadoras Recomendadas**

### **Internacionais:**
- **DHL**: Rápido e confiável
- **FedEx**: Bom custo-benefício
- **UPS**: Cobertura ampla
- **USPS**: Mais econômico

### **Nacionais:**
- **Correios**: SEDEX e PAC
- **Transportadoras privadas**: Mais rápidas

## 💡 **Dicas para Economizar**

### **1. Consolide Pacotes**
- Compre de várias lojas
- Envie tudo junto
- Economize no frete

### **2. Aproveite Promoções**
- Black Friday e Cyber Monday
- Promoções de fim de temporada
- Cupons e códigos promocionais

### **3. Escolha o Peso Ideal**
- Conheça as faixas de peso das transportadoras
- Otimize o peso da sua remessa
- Evite pesos que custam mais caro

### **4. Compare Preços**
- Use ferramentas de comparação
- Negocie com transportadoras
- Considere o custo total

## 📞 **Suporte e Ajuda**

### **Problemas Comuns:**
- **Produto não chegou**: Verifique o rastreamento
- **Impostos altos**: Calcule antes de comprar
- **Produto danificado**: Acione a garantia
- **Atraso na entrega**: Entre em contato com a transportadora

### **Onde Buscar Ajuda:**
- Suporte da loja onde comprou
- Transportadora responsável
- Receita Federal (para questões aduaneiras)
- Euaconecta (para serviços de redirecionamento)

## 🎯 **Checklist Final**

### **Antes de Comprar:**
- [ ] Definiu o orçamento total
- [ ] Escolheu produtos permitidos
- [ ] Pesquisou preços
- [ ] Verificou políticas da loja

### **Durante a Compra:**
- [ ] Usou cupons e promoções
- [ ] Confirmou endereço americano
- [ ] Verificou dados de pagamento
- [ ] Salvou comprovantes

### **Após a Compra:**
- [ ] Acompanhou o rastreamento
- [ ] Consolidou pacotes (se necessário)
- [ ] Escolheu transportadora
- [ ] Preparou documentação

## 🚀 **Próximos Passos**

Agora que você conhece o processo, está pronto para fazer sua primeira importação! Lembre-se:

1. **Comece pequeno** para ganhar experiência
2. **Use serviços confiáveis** como o da Euaconecta
3. **Mantenha-se informado** sobre mudanças na legislação
4. **Aprenda com cada importação** para melhorar

**Boa sorte com sua primeira importação!** 🎉`,
    author: 'Equipe Euaconecta',
    category: 'dicas-importacao',
    tags: ['primeira importação', 'guia', 'tutorial', 'iniciante'],
    featuredImage: '/images/blog/primeira-importacao.jpg',
    status: 'published',
    isFeatured: true,
    views: 0,
    likes: 0,
    publishedAt: '2024-01-25T10:00:00Z',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z',
    seoTitle: 'Guia Completo: Primeira Importação dos EUA - Euaconecta',
    seoDescription: 'Aprenda como fazer sua primeira importação dos Estados Unidos com este guia completo. Passo a passo sem erros.',
    seoKeywords: ['primeira importação', 'importar EUA', 'guia importação', 'tutorial importação']
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let posts: BlogPost[] = []

    if (fs.existsSync(BLOG_FILE)) {
      posts = JSON.parse(fs.readFileSync(BLOG_FILE, 'utf8'))
    } else {
      // Criar arquivo inicial
      fs.writeFileSync(BLOG_FILE, JSON.stringify(defaultPosts, null, 2))
      posts = defaultPosts
    }

    // Filtrar apenas posts publicados
    posts = posts.filter(post => post.status === 'published')

    // Aplicar filtros
    if (category) {
      posts = posts.filter(post => post.category === category)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    if (featured === 'true') {
      posts = posts.filter(post => post.isFeatured)
    }

    // Ordenar por data de publicação (mais recentes primeiro)
    posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    // Aplicar paginação
    const total = posts.length
    const paginatedPosts = posts.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedPosts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Erro ao buscar posts do blog:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newPost: BlogPost = {
      id: body.slug || `post-${Date.now()}`,
      title: body.title,
      slug: body.slug || `post-${Date.now()}`,
      excerpt: body.excerpt,
      content: body.content,
      author: body.author || 'Equipe Euaconecta',
      category: body.category,
      tags: body.tags || [],
      featuredImage: body.featuredImage,
      status: body.status || 'draft',
      isFeatured: body.isFeatured || false,
      views: 0,
      likes: 0,
      publishedAt: body.status === 'published' ? new Date().toISOString() : '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      seoKeywords: body.seoKeywords || []
    }

    let posts: BlogPost[] = []
    if (fs.existsSync(BLOG_FILE)) {
      posts = JSON.parse(fs.readFileSync(BLOG_FILE, 'utf8'))
    }

    posts.push(newPost)
    fs.writeFileSync(BLOG_FILE, JSON.stringify(posts, null, 2))

    return NextResponse.json({
      success: true,
      data: newPost,
      message: 'Post criado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao criar post:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
