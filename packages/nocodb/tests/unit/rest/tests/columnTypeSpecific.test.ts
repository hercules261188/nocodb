import 'mocha';
import init from '../../init';
import { createProject, createSakilaProject } from '../../factory/project';
import request from 'supertest';
import { ColumnType, UITypes } from 'nocodb-sdk';
import { createQrCodeColumn, createColumn } from '../../factory/column';
import { createTable, getTable } from '../../factory/table';
import Model from '../../../../src/lib/models/Model';
import Project from '../../../../src/lib/models/Project';
import { expect } from 'chai';
import Column from '../../../../src/lib/models/Column';
import { table } from 'console';
import { title } from 'process';

function columnTypeSpecificTests() {
  let context;
  let project: Project;
  let sakilaProject: Project;
  let customerTable: Model;
  let qrValueReferenceColumn: Column; 

  const qrValueReferenceColumnTitle = 'Qr Value Column';
  const qrCodeReferenceColumnTitle = 'Qr Code Column';

  beforeEach(async function () {
    context = await init();

    sakilaProject = await createSakilaProject(context);
    project = await createProject(context);

    customerTable = await getTable({
      project: sakilaProject,
      name: 'customer',
    });

    qrValueReferenceColumn = await createColumn(context, customerTable, {
      title: qrValueReferenceColumnTitle,
      uidt: UITypes.SingleLineText,
      table_name: customerTable.table_name,
      column_name: title,
    });
  });

  describe('Qr Code Column', () => {
    describe('adding a QR code column which references the column ', async () => {
      beforeEach(async function () {
        await createQrCodeColumn(context, {
          title: qrCodeReferenceColumnTitle,
          table: customerTable,
          referencedQrValueTableColumnTitle: qrValueReferenceColumnTitle,
        });
      });
      it('delivers the same cell values as the referenced column', async () => {
        const resp = await request(context.app)
          .get(`/api/v1/db/data/noco/${sakilaProject.id}/${customerTable.id}`)
          .set('xc-auth', context.token)
          .expect(200);
        expect(resp.body.list[0][qrValueReferenceColumnTitle]).to.eql(
          resp.body.list[0][qrCodeReferenceColumnTitle]
        );
        expect(resp.body.list.map((row) => row[qrValueReferenceColumnTitle])).to.eql(
          resp.body.list.map((row) => row[qrCodeReferenceColumnTitle])
        );
      });

      it('gets deleted if the referenced column gets deleted', async () => {
        // delete referenced value column
        const columnsBeforeReferencedColumnDeleted =
          await customerTable.getColumns();

        expect(
          columnsBeforeReferencedColumnDeleted.some(
            (col) => col['title'] === qrCodeReferenceColumnTitle
          )
        ).to.eq(true);

        const response = await request(context.app)
          .delete(`/api/v1/db/meta/columns/${qrValueReferenceColumn.id}`)
          .set('xc-auth', context.token)
          .send({});

        const columnsAfterReferencedColumnDeleted =
          await customerTable.getColumns();
        expect(
          columnsAfterReferencedColumnDeleted.some(
            (col) => col['title'] === qrCodeReferenceColumnTitle
          )
        ).to.eq(false);
      });
    });
  });
}

export default function () {
  describe('Column types specific behavior', columnTypeSpecificTests);
}
