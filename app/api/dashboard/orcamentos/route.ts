import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserId } from '@/app/src/config/firebaseAdmin.js';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const userId = await getUserId(req);

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'Não autorizado' }), { status: 401 });
    }

    const body = await req.json();
    const {
      empresa,
      cliente,
      numeroOrdem,
      data,
      dataEntrega,
      descricaoServico,
      enderecoCobranca,
      localPrestacao,
      custosFixos,
      custosVariaveis,
      margemLucro,
      impostos,
      tempoExecucao,
      itens,
      formaPagamento,
      desconto,
      acrescimos,
      condicoesPersonalizadas,
      totalFinal, // Adicionado para salvar o valor final calculado
    } = body;

    // Validação básica
    if (!empresa || !cliente || !numeroOrdem || !totalFinal) {
      return new NextResponse(JSON.stringify({ error: 'Campos obrigatórios faltando' }), { status: 400 });
    }

    // Empresa e cliente precisam ser do próprio usuário.
    const [empresaDoUsuario, clienteDoUsuario] = await Promise.all([
      prisma.company.findFirst({ where: { id_company: empresa.id_company, id_user: userId } }),
      prisma.client.findFirst({ where: { id_client: cliente.id_client, id_user: userId } }),
    ]);
    if (!empresaDoUsuario || !clienteDoUsuario) {
      return new NextResponse(JSON.stringify({ error: 'Empresa ou cliente não encontrado' }), { status: 404 });
    }

    const orcamento = await prisma.orcamento.create({
      data: {
        userId,
        numeroOrdem,
        data: new Date(data),
        dataEntrega: dataEntrega ? new Date(dataEntrega) : null,
        descricaoServico,
        enderecoCobranca,
        margemLucro,
        impostos,
        tempoExecucao,
        formaPagamento,
        desconto,
        acrescimos,
        condicoesPersonalizadas,
        total: totalFinal,
        empresa: {
          connect: { id_company: empresa.id_company },
        },
        cliente: {
          connect: { id_client: cliente.id_client },
        },
        // Relações de um-para-muitos
        localPrestacao: {
          create: localPrestacao,
        },
        custosFixos: {
          create: custosFixos.map((cf: any) => ({
            descricao: cf.descricao,
            valor: cf.valor,
          })),
        },
        custosVariaveis: {
          create: custosVariaveis.map((cv: any) => ({
            categoria: cv.categoria,
            descricao: cv.descricao,
            valor: cv.valor,
            unidade: cv.unidade,
            quantidade: cv.quantidade,
            observacoes: cv.observacoes,
          })),
        },
        itens: {
          create: itens.map((item: any) => ({
            quantidade: item.quantidade,
            descricao: item.descricao,
            precoUnitario: item.precoUnitario,
            totalItem: item.totalItem,
          })),
        },
      },
      include: {
        empresa: true,
        cliente: true,
        localPrestacao: true,
        custosFixos: true,
        custosVariaveis: true,
        itens: true,
      }
    });

    return new NextResponse(JSON.stringify(orcamento), { status: 201 });
  } catch (error) {
    console.error('Erro ao criar orçamento:', error);
    return new NextResponse(JSON.stringify({ error: 'Erro interno do servidor' }), { status: 500 });
  }
}
