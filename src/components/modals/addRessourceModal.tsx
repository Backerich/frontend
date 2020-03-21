import React from "react";
import { Modal } from "./modal";
import { Frontend } from "../../frontend";
import { Dashboard, CurrentDashboardModal } from "../pages/dashboard";
import { MedRessource, ProvideMedRessourceRequest, ProvideMedRessourceResponse } from "../../models/network";
import { BtnLoadingSpinner } from "../loading";

export class AddRessourceModal extends React.Component<{
    dashboard: Dashboard
}, {
    ressource_title: string,
    ressource_amount: number,
    ressource_description: string,
    isInserting: boolean
}> {

    constructor(props) {
        super(props);
        this.state = { 
            isInserting: false,
            ressource_amount: -1,
            ressource_title: "",
            ressource_description: ""
        };
    }

    render() {
        let fe = Frontend.getFrontend();

        return <Modal dashboard={this.props.dashboard} 
            title={fe.lang.PROVIDE_RESSOURCE} footer={this.renderFooter()}>
            <form>
                <div className="form-group row">
                    <label className="col-sm-3 col-form-label">{fe.lang.TITLE}</label>
                    <div className="col-sm-9">
                        <input type="text" className="form-control" disabled={this.state.isInserting}
                            id="inputTitle" placeholder={fe.lang.ADDRESSOURCE_TITLE_PLH} 
                            onChange={(evt) => {this.setState({ ressource_title: evt.target.value })}}/>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-3 col-form-label">{fe.lang.AMOUNT}</label>
                    <div className="col-sm-4">
                        <input type="number" className="form-control" disabled={this.state.isInserting}
                            id="inputAmount" placeholder={fe.lang.ADDRESSOURCE_AMOUNT_PLH}
                            onChange={(evt) => {this.setState({ ressource_amount: parseInt(evt.target.value) })}}/>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-3 col-form-label">{fe.lang.DESCRIPTION}</label>
                    <div className="col-sm-9">
                        <textarea className="form-control" rows={6} disabled={this.state.isInserting}
                            id="inputDescription" placeholder={fe.lang.ADDRESSOURCE_DESCRIPTION_PLH} 
                            onChange={(evt) => {this.setState({ ressource_description: evt.target.value })}}/>
                    </div>
                </div>
            </form>
        </Modal>;
    }

    renderFooter() {
        let fe = Frontend.getFrontend();

        return [
            <button type="button" className="btn btn-success" disabled={this.state.isInserting}
            onClick={() => {
                this.onInsert();
            }} key="modFtBtn1">{fe.lang.ACTION_ADD} {this.state.isInserting ? <BtnLoadingSpinner /> : ""}</button>,
            <button type="button" className="btn btn-secondary" disabled={this.state.isInserting}
            onClick={() => {
                this.props.dashboard.showModal(CurrentDashboardModal.None);
            }} key="modFtBtn2">{fe.lang.ACTION_CANCEL}</button>
        ]
    }

    async onInsert() {
        let newMedRessource: MedRessource = {
            amount: this.state.ressource_amount,
            createdAt: new Date(),
            description: this.state.ressource_description,
            owner: null as any,
            title: this.state.ressource_title,
            uuid: uuidv4()
        };

        this.setState({ isInserting: true });
        
        let fe = Frontend.getFrontend();
        let req = new ProvideMedRessourceRequest(newMedRessource);
        let res = await fe.backend.transceive(req);
        let resData: ProvideMedRessourceResponse = res.data;

        // resData.success
        this.setState({ isInserting: false });
        
        this.props.dashboard.showModal(CurrentDashboardModal.None);
    }

}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}