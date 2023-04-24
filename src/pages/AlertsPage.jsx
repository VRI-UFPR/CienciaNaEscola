import React from 'react';
import RecoveryAlert from '../components/RecoveryAlert';

const styles = ``;

function AlertsPage(props) {
    return (
        <div>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#EndProtocolModal">
                Launch demo modal
            </button>
            <div className="modal fade" id="EndProtocolModal" tabindex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered p-5 p-md-1">
                    <div className="modal-content bg-transparent border-0">
                        <RecoveryAlert />
                    </div>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default AlertsPage;
