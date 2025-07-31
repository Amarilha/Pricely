import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';
import type { NextApiRequest } from 'next';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId } = getAuth(req as any);

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
