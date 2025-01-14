import React from 'react';
import { mount } from 'enzyme';
import {
  getNode,
  getApi,
  getColumn,
  getActions,
  notCalledExcept,
  getContext
} from '../../test/aggrid-helper';
import CellRenderer from './table-view/cell-renderer';

describe('<CellRenderer />', () => {
  describe('#render', () => {
    let component;
    let rowNode;
    let value;
    const api = getApi();
    const column = getColumn();
    const actions = getActions();
    const context = getContext([]);

    describe('element is valid', () => {
      before((done) => {
        rowNode = getNode({field1: 'value'});
        value = rowNode.data.hadronDocument.get('field1');
        component = mount(
          <CellRenderer
            api={api}
            column={column}
            node={rowNode}
            value={value}
            drillDown={actions.drillDown}
            elementAdded={actions.elementAdded}
            elementRemoved={actions.elementRemoved}
            elementTypeChanged={actions.elementTypeChanged}
            tz="UTC"
            parentType=""
            context={context}/>
        );
        done();
      });
      it('renders the element type correctly', () => {
        const wrapper = component.find('.table-view-cell .element-value');
        expect(wrapper.matchesElement(<div title="value">"value"</div>)).to.eq(
          true
        );
      });
      it('does not render the undo button', () => {
        const wrapper = component.find('.table-view-cell-circle-button');
        expect(wrapper.find('.fa-rotate-left')).to.not.be.present();
      });
      it('does not render the expand button', () => {
        const wrapper = component.find('.table-view-cell-circle-button');
        expect(wrapper.find('.fa-expand')).to.not.be.present();
      });
    });

    describe('element is added', () => {
      before((done) => {
        rowNode = getNode({});
        rowNode.data.hadronDocument.insertEnd('field1', 'value');
        value = rowNode.data.hadronDocument.get('field1');
        component = mount(
          <CellRenderer
            api={api}
            column={column}
            node={rowNode}
            value={value}
            drillDown={actions.drillDown}
            elementAdded={actions.elementAdded}
            elementRemoved={actions.elementRemoved}
            elementTypeChanged={actions.elementTypeChanged}
            parentType=""
            tz="UTC"
            context={context}/>
        );
        done();
      });
      it('renders the cell as added', () => {
        const wrapper = component.find('.table-view-cell-is-added .element-value');
        expect(wrapper.matchesElement(<div title="value">"value"</div>)).to.eq(
          true
        );
      });
      it('renders the undo button', () => {
        const wrapper = component.find('.table-view-cell-circle-button');
        expect(wrapper.find('.fa-rotate-left')).to.be.present();
      });
      it('does not render the expand button', () => {
        const wrapper = component.find('.table-view-cell-circle-button');
        expect(wrapper.find('.fa-expand')).to.not.be.present();
      });
    });

    describe('element is modified', () => {
      before((done) => {
        rowNode = getNode({field1: 'value'});
        rowNode.data.hadronDocument.get('field1').edit('a new value');
        value = rowNode.data.hadronDocument.get('field1');
        component = mount(
          <CellRenderer
            api={api}
            column={column}
            node={rowNode}
            value={value}
            drillDown={actions.drillDown}
            elementAdded={actions.elementAdded}
            elementRemoved={actions.elementRemoved}
            elementTypeChanged={actions.elementTypeChanged}
            parentType=""
            tz="UTC"
            context={context}/>
        );
        done();
      });
      it('renders the element as modified', () => {
        const wrapper = component.find('.table-view-cell-is-edited .element-value');
        expect(wrapper.matchesElement(<div title="a new value">"a new value"</div>)).to.eq(
          true
        );
      });
      it('renders the undo button', () => {
        const wrapper = component.find('.table-view-cell-circle-button');
        expect(wrapper.find('.fa-rotate-left')).to.be.present();
      });
      it('does not render the expand button', () => {
        const wrapper = component.find('.table-view-cell-circle-button');
        expect(wrapper.find('.fa-expand')).to.not.be.present();
      });
    });

    describe('element is removed', () => {
      before((done) => {
        rowNode = getNode({field1: 'value'});
        rowNode.data.hadronDocument.get('field1').remove();
        value = rowNode.data.hadronDocument.get('field1');
        component = mount(
          <CellRenderer
            api={api}
            column={column}
            node={rowNode}
            value={value}
            drillDown={actions.drillDown}
            elementAdded={actions.elementAdded}
            elementRemoved={actions.elementRemoved}
            elementTypeChanged={actions.elementTypeChanged}
            parentType=""
            tz="UTC"
            context={context}/>
        );
        done();
      });
      it('renders the element as removed', () => {
        const wrapper = component.find('.table-view-cell-is-deleted');
        expect(wrapper.text()).to.contain('Deleted field');
      });
      it('renders the undo button', () => {
        const wrapper = component.find('.table-view-cell-circle-button');
        expect(wrapper.find('.fa-rotate-left')).to.be.present();
      });
      it('does not render the expand button', () => {
        const wrapper = component.find('.table-view-cell-circle-button');
        expect(wrapper.find('.fa-expand')).to.not.be.present();
      });
    });

    describe('element is invalid', () => {
      before((done) => {
        rowNode = getNode({field1: 'value'});
        rowNode.data.hadronDocument.get('field1').setInvalid(
          'invalid', 'String', 'message');
        value = rowNode.data.hadronDocument.get('field1');
        component = mount(
          <CellRenderer
            api={api}
            column={column}
            node={rowNode}
            value={value}
            drillDown={actions.drillDown}
            elementAdded={actions.elementAdded}
            elementRemoved={actions.elementRemoved}
            elementTypeChanged={actions.elementTypeChanged}
            parentType=""
            tz="UTC"
            context={context}/>
        );
        done();
      });
      it('renders the element as invalid', () => {
        const wrapper = component.find('.table-view-cell-is-invalid');
        expect(wrapper).to.contain(<div className="editable-element-value-is-string editable-element-value-is-invalid-type">invalid</div>);
      });
      it('does not render the expand button', () => {
        const wrapper = component.find('.table-view-cell-circle-button');
        expect(wrapper.find('.fa-expand')).to.not.be.present();
      });
    });

    describe('element is empty', () => {
      before((done) => {
        rowNode = getNode({});
        value = undefined;
        component = mount(
          <CellRenderer
            api={api}
            column={column}
            node={rowNode}
            value={value}
            drillDown={actions.drillDown}
            elementAdded={actions.elementAdded}
            elementRemoved={actions.elementRemoved}
            elementTypeChanged={actions.elementTypeChanged}
            parentType=""
            tz="UTC"
            context={context}/>
        );
        done();
      });
      it('renders the element as empty', () => {
        const wrapper = component.find('.table-view-cell-is-empty');
        expect(wrapper.text()).to.contain('No field');
      });
      it('does not render the undo button', () => {
        const wrapper = component.find('.table-view-cell-circle-button');
        expect(wrapper.find('.fa-rotate-left')).to.not.be.present();
      });
      it('does not render the expand button', () => {
        const wrapper = component.find('.table-view-cell-circle-button');
        expect(wrapper.find('.fa-expand')).to.not.be.present();
      });
    });

    describe('index of element is out of range', () => {
      before((done) => {
        rowNode = getNode({array: [1, 2]});
        value = undefined;
        const context2 = getContext(['array']);
        const column2 = getColumn(4);
        component = mount(
          <CellRenderer
            api={api}
            column={column2}
            node={rowNode}
            value={value}
            drillDown={actions.drillDown}
            elementAdded={actions.elementAdded}
            elementRemoved={actions.elementRemoved}
            elementTypeChanged={actions.elementTypeChanged}
            parentType=""
            tz="UTC"
            context={context2}/>
        );
        done();
      });
      it('renders the element as uneditable', () => {
        const wrapper = component.find('.table-view-cell-is-uneditable');
        expect(wrapper.text()).to.equal('');
      });
      it('does not render the undo button', () => {
        const wrapper = component.find('.table-view-cell-circle-button');
        expect(wrapper.find('.fa-rotate-left')).to.not.be.present();
      });
      it('does not render the expand button', () => {
        const wrapper = component.find('.table-view-cell-circle-button');
        expect(wrapper.find('.fa-expand')).to.not.be.present();
      });
    });

    describe('parent type of element is incorrect', () => {
      describe('is array, object expected', () => {
        before((done) => {
          rowNode = getNode({array: [1, 2]});
          value = rowNode.data.hadronDocument.getChild(['array', 1]);
          const context2 = getContext(['array']);
          const column2 = getColumn(1);
          component = mount(
            <CellRenderer
              api={api}
              column={column2}
              node={rowNode}
              value={value}
              drillDown={actions.drillDown}
              elementAdded={actions.elementAdded}
              elementRemoved={actions.elementRemoved}
              elementTypeChanged={actions.elementTypeChanged}
              context={context2}
              tz="UTC"
              parentType={'Object'} />
          );
          done();
        });
        it('renders the element as uneditable', () => {
          const wrapper = component.find('.table-view-cell-is-uneditable');
          expect(wrapper.text()).to.equal('');
        });
        it('does not render the undo button', () => {
          const wrapper = component.find('.table-view-cell-circle-button');
          expect(wrapper.find('.fa-rotate-left')).to.not.be.present();
        });
        it('does not render the expand button', () => {
          const wrapper = component.find('.table-view-cell-circle-button');
          expect(wrapper.find('.fa-expand')).to.not.be.present();
        });
      });
      describe('is object, array expected', () => {
        before((done) => {
          rowNode = getNode({obj: {field1: 1, field2: 2}});
          value = rowNode.data.hadronDocument.getChild(['obj', 'field1']);
          const context2 = getContext(['obj']);
          const column2 = getColumn('field1');
          component = mount(
            <CellRenderer
              api={api}
              column={column2}
              node={rowNode}
              value={value}
              drillDown={actions.drillDown}
              elementAdded={actions.elementAdded}
              elementRemoved={actions.elementRemoved}
              elementTypeChanged={actions.elementTypeChanged}
              context={context2}
              tz="UTC"
              parentType={'Array'}/>
          );
          done();
        });
        it('renders the element as uneditable', () => {
          const wrapper = component.find('.table-view-cell-is-uneditable');
          expect(wrapper.text()).to.equal('');
        });
        it('does not render the undo button', () => {
          const wrapper = component.find('.table-view-cell-circle-button');
          expect(wrapper.find('.fa-rotate-left')).to.not.be.present();
        });
        it('does not render the expand button', () => {
          const wrapper = component.find('.table-view-cell-circle-button');
          expect(wrapper.find('.fa-expand')).to.not.be.present();
        });
      });
    });

    describe('element is expandable', () => {
      before((done) => {
        rowNode = getNode({field1: {subfield1: 1}});
        value = rowNode.data.hadronDocument.get('field1');
        component = mount(
          <CellRenderer
            api={api}
            column={column}
            node={rowNode}
            value={value}
            drillDown={actions.drillDown}
            elementAdded={actions.elementAdded}
            elementRemoved={actions.elementRemoved}
            elementTypeChanged={actions.elementTypeChanged}
            parentType=""
            tz="UTC"
            context={context}/>
        );
        done();
      });
      it('renders the element correctly', () => {
        const wrapper = component.find('.table-view-cell');
        expect(wrapper.text()).to.contain('{} 1 fields');
      });
      it('does not render the undo button', () => {
        const wrapper = component.find('.table-view-cell-circle-button');
        expect(wrapper.find('.fa-rotate-left')).to.not.be.present();
      });
      it('renders the expand button', () => {
        const wrapper = component.find('.table-view-cell-circle-button');
        expect(wrapper.find('.fa-expand')).to.be.present();
      });
    });

    describe('element is array', () => {
      before((done) => {
        rowNode = getNode({field1: [1, 2, 3]});
        value = rowNode.data.hadronDocument.get('field1');
        component = mount(
          <CellRenderer
            api={api}
            column={column}
            node={rowNode}
            value={value}
            drillDown={actions.drillDown}
            elementAdded={actions.elementAdded}
            elementRemoved={actions.elementRemoved}
            elementTypeChanged={actions.elementTypeChanged}
            parentType=""
            tz="UTC"
            context={context}/>
        );
        done();
      });
      it('renders the element correctly', () => {
        const wrapper = component.find('.table-view-cell');
        expect(wrapper.text()).to.contain('[] 3 elements');
      });
    });

    describe('element is expandable and modified', () => {
      before((done) => {
        rowNode = getNode({field1: {subfield1: 1}});
        rowNode.data.hadronDocument.getChild(
          ['field1', 'subfield1']).edit('a new value');
        value = rowNode.data.hadronDocument.get('field1');
        component = mount(
          <CellRenderer
            api={api}
            column={column}
            node={rowNode}
            value={value}
            drillDown={actions.drillDown}
            elementAdded={actions.elementAdded}
            elementRemoved={actions.elementRemoved}
            elementTypeChanged={actions.elementTypeChanged}
            parentType=""
            tz="UTC"
            context={context}/>
        );
        done();
      });
      it('renders the undo button', () => {
        const wrapper = component.find('.table-view-cell-circle-button-left');
        expect(wrapper.find('.fa-rotate-left')).to.be.present();
      });
      it('renders the expand button', () => {
        const wrapper = component.find('.table-view-cell-circle-button');
        expect(wrapper.find('.fa-expand')).to.be.present();
      });
    });
  });

  describe('#actions', () => {
    let component;
    let rowNode;
    let value;
    let api;
    let actions;
    const column = getColumn();
    const context = getContext([]);

    describe('undo', () => {
      describe('clicking undo on an element', () => {
        before((done) => {
          rowNode = getNode({field1: 'value'});
          rowNode.data.hadronDocument.get('field1').edit('a new value');
          value = rowNode.data.hadronDocument.get('field1');
          api = getApi();
          actions = getActions();
          component = mount(
            <CellRenderer
              api={api}
              column={column}
              node={rowNode}
              value={value}
              drillDown={actions.drillDown}
              elementAdded={actions.elementAdded}
              elementRemoved={actions.elementRemoved}
              elementTypeChanged={actions.elementTypeChanged}
              parentType=""
              tz="UTC"
              context={context}/>
          );
          const wrapper = component.find('.table-view-cell-circle-button');
          wrapper.simulate('click');
          done();
        });
        it('reverts the element', () => {
          expect(value.isModified()).to.equal(false);
        });
        it('renders the original element', () => {
          const wrapper = component.find('.table-view-cell .element-value');
          expect(wrapper.matchesElement(<div title="value">"value"</div>)).to.eq(
            true
          );
        });
        it('does not render the undo button', () => {
          const wrapper = component.find('.table-view-cell-circle-button');
          expect(wrapper.find('.fa-rotate-left')).to.not.be.present();
        });
      });

      describe('clicking undo on an added element', () => {
        before((done) => {
          rowNode = getNode({});
          rowNode.data.hadronDocument.elements.flush();
          rowNode.data.hadronDocument.insertEnd('field1', 'value');
          value = rowNode.data.hadronDocument.get('field1');
          api = getApi();
          actions = getActions();
          component = mount(
            <CellRenderer
              api={api}
              column={column}
              node={rowNode}
              value={value}
              drillDown={actions.drillDown}
              elementAdded={actions.elementAdded}
              elementRemoved={actions.elementRemoved}
              elementTypeChanged={actions.elementTypeChanged}
              parentType=""
              tz="UTC"
              context={context}/>
          );
          const wrapper = component.find('.table-view-cell-circle-button');
          wrapper.simulate('click');
          done();
        });
        it('calls elementRemoved action', () => {
          expect(actions.elementRemoved.callCount).to.equal(1);
          expect(actions.elementRemoved.alwaysCalledWithExactly(
            'field1', '1', false)).to.equal(true);
          notCalledExcept(actions, ['elementRemoved']);
          notCalledExcept(api, []);
        });
        it('renders an empty element', () => {
          const wrapper = component.find('.table-view-cell-is-empty');
          expect(wrapper.text()).to.contain('No field');
        });
      });

      describe('clicking undo on an type changed element', () => {
        before((done) => {
          rowNode = getNode({field1: 'value'});
          rowNode.data.hadronDocument.get('field1').edit(100);
          value = rowNode.data.hadronDocument.get('field1');
          api = getApi();
          actions = getActions();
          component = mount(
            <CellRenderer
              api={api}
              column={column}
              node={rowNode}
              value={value}
              drillDown={actions.drillDown}
              elementAdded={actions.elementAdded}
              elementRemoved={actions.elementRemoved}
              elementTypeChanged={actions.elementTypeChanged}
              parentType=""
              tz="UTC"
              context={context}/>
          );
          const wrapper = component.find('.table-view-cell-circle-button');
          wrapper.simulate('click');
          done();
        });
        it('calls elementTypeChanged action', () => {
          expect(actions.elementTypeChanged.callCount).to.equal(1);
          expect(actions.elementTypeChanged.alwaysCalledWithExactly(
            'field1', 'String', '1')).to.equal(true);
          notCalledExcept(actions, ['elementTypeChanged']);
          notCalledExcept(api, []);
        });
        it('renders the original value', () => {
          const wrapper = component.find('.table-view-cell .element-value');
          expect(wrapper.matchesElement(<div title="value">"value"</div>)).to.eq(
            true
          );
        });
      });

      describe('clicking undo on a removed element', () => {
        before((done) => {
          rowNode = getNode({field1: 'value'});
          rowNode.data.hadronDocument.get('field1').remove();
          value = rowNode.data.hadronDocument.get('field1');
          api = getApi();
          actions = getActions();
          component = mount(
            <CellRenderer
              api={api}
              column={column}
              node={rowNode}
              value={value}
              drillDown={actions.drillDown}
              elementAdded={actions.elementAdded}
              elementRemoved={actions.elementRemoved}
              elementTypeChanged={actions.elementTypeChanged}
              parentType=""
              tz="UTC"
              context={context}/>
          );
          const wrapper = component.find('.table-view-cell-circle-button');
          wrapper.simulate('click');
          done();
        });
        it('calls elementAdded action', () => {
          expect(actions.elementAdded.callCount).to.equal(1);
          expect(actions.elementAdded.alwaysCalledWithExactly(
            'field1', 'String', '1')).to.equal(true);
          notCalledExcept(actions, ['elementAdded']);
          notCalledExcept(api, []);
        });
        it('renders the original value', () => {
          const wrapper = component.find('.table-view-cell .element-value');
          expect(wrapper.matchesElement(<div title="value">"value"</div>)).to.eq(
            true
          );
        });
      });
    });

    describe('drill down', () => {
      before((done) => {
        api = getApi();
        actions = getActions();
        rowNode = getNode({field1: {subfield1: 1}});
        value = rowNode.data.hadronDocument.get('field1');
        component = mount(
          <CellRenderer
            api={api}
            column={column}
            node={rowNode}
            value={value}
            drillDown={actions.drillDown}
            elementAdded={actions.elementAdded}
            elementRemoved={actions.elementRemoved}
            elementTypeChanged={actions.elementTypeChanged}
            parentType=""
            tz="UTC"
            context={context}/>
        );
        const wrapper = component.find('.table-view-cell-circle-button');
        wrapper.simulate('click');
        done();
      });
      it('calls drillDown action', () => {
        expect(actions.drillDown.callCount).to.equal(1);
        expect(actions.drillDown.alwaysCalledWithExactly(
          rowNode.data.hadronDocument, value)).to.equal(true);
        notCalledExcept(actions, ['drillDown']);
        notCalledExcept(api, []);
      });
    });

    describe('in non-editing mode', () => {
      before((done) => {
        api = getApi();
        actions = getActions();
        rowNode = getNode({field1: 'value'});
        value = rowNode.data.hadronDocument.get('field1');
        component = mount(
          <CellRenderer
            api={api}
            column={column}
            node={rowNode}
            value={value} drillDown={actions.drillDown}
            elementAdded={actions.elementAdded}
            elementRemoved={actions.elementRemoved}
            elementTypeChanged={actions.elementTypeChanged}
            parentType=""
            tz="UTC"
            context={context}/>
        );
        const wrapper = component.find('.table-view-cell');
        wrapper.simulate('click');
        done();
      });
      it('clicking does not start editing', () => {
        notCalledExcept(actions, []);
        notCalledExcept(api, []);
      });
    });

    describe('in editing mode', () => {
      before((done) => {
        api = getApi();
        actions = getActions();
        rowNode = getNode({field1: 'value'});
        rowNode.data.state = 'editing';
        value = rowNode.data.hadronDocument.get('field1');
        component = mount(
          <CellRenderer
            api={api}
            column={column}
            node={rowNode}
            value={value}
            drillDown={actions.drillDown}
            elementAdded={actions.elementAdded}
            elementRemoved={actions.elementRemoved}
            elementTypeChanged={actions.elementTypeChanged}
            parentType=""
            tz="UTC"
            context={context}/>
        );
        const wrapper = component.find('.table-view-cell');
        wrapper.simulate('click');
        done();
      });
      it('clicking starts editing', () => {
        expect(api.startEditingCell.callCount).to.equal(1);
        expect(api.startEditingCell.alwaysCalledWithExactly({
          rowIndex: 0, colKey: 'field1'
        }));
        notCalledExcept(actions, []);
        notCalledExcept(api, ['startEditingCell']);
      });
    });
  });
});
