export const card ={
    emr:{
        fire: function (det) {
            return `<div class="report-card card-fire" id="${det.ReqID}">
                    <div class="report-container">
                        <div class="header">
                            <h2>Fire Emergency</h2>
                            <div class="r-date">${det.ReqTime}</div>
                            <div class="r-id">${det.ReqID}</div>
                            <div class="tag r-fire tag-type"><i class="bi bi-fire"></i>Fire</div>
                            <div class="tag r-s r-s-o"></div>
                        </div>
                        <div class="discription">
                            <ul>
                                <li><strong>Request By:</strong> ${det.uid}</li>
                                <li><strong>Status:</strong> ${det.ReqStatus}</li>
                                <li><strong>Location:</strong> ${det.ReqLoc}</li>
                                <li><strong>Reported At:</strong> ${det.ReqTime}</li>
                            </ul>
                        </div>
                        <div class="action">
                            <button class="btn btn-warning" onclick="markDispatched(this)">Mark Dispatched</button>
                        </div>
                    </div>
                </div>`
        },
        medical: function (det){
            return `<div class="report-card card-medi" id="${det.ReqID}">
                    <div class="report-container">
                        <div class="header">
                            <h2>Medical Emergency</h2>
                            <div class="r-date">${det.ReqTime}</div>
                            <div class="r-id">${det.ReqID}</div>
                            <div class="tag r-poli tag-type"><i class="bi bi-shield-exclamation"></i>Medical</div>
                            <div class="tag r-s r-s-o"></div>
                        </div>
                        <div class="discription">
                            <ul>
                                <li><strong>Request By:</strong> ${det.uid}</li>
                                <li><strong>Status:</strong> ${det.ReqStatus}</li>
                                <li><strong>Location:</strong> ${det.ReqLoc}</li>
                                <li><strong>Reported At:</strong> ${det.ReqTime}</li>
                            </ul>
                        </div>
                        <div class="action">
                            <button class="btn btn-warning" onclick="markDispatched(this)">Mark Dispatched</button>
                        </div>
                    </div>
                </div>`
        },
        police: function (det) {
            return `<div class="report-card card-poli" id="${det.ReqID}">
                    <div class="report-container">
                        <div class="header">
                            <h2>Police Emergency</h2>
                            <div class="r-date">${det.ReqTime}</div>
                            <div class="r-id">${det.ReqID}</div>
                            <div class="tag r-poli tag-type"><i class="bi bi-poli"></i>Police</div>
                            <div class="tag r-s r-s-o"></div>
                        </div>
                        <div class="discription">
                            <ul>
                                <li><strong>Request By:</strong> ${det.uid}</li>
                                <li><strong>Status:</strong> ${det.ReqStatus}</li>
                                <li><strong>Location:</strong> ${det.ReqLoc}</li>
                                <li><strong>Reported At:</strong> ${det.ReqTime}</li>
                            </ul>
                        </div>
                        <div class="action">
                            <button class="btn btn-warning" onclick="markDispatched(this)">Mark Dispatched</button>
                        </div>
                    </div>
                </div>`
        }
    },
    cmp:function (det){
        return `<div class="report-card card-norm" id="${det.ReqID}">
                    <div class="report-container">
                        <div class="header">
                            <h2>Fire Emergency</h2>
                            <div class="r-date">${det.ReqTime}</div>
                            <div class="r-id">${det.ReqID}</div>
                            <div class="tag r-fire tag-type"><i class="bi bi-fire"></i>Fire</div>
                            <div class="tag r-s r-s-o"></div>
                        </div>
                        <div class="discription">
                            <ul>
                                <li><strong>Request By:</strong> ${det.uid}</li>
                                <li><strong>Status:</strong> ${det.ReqStatus}</li>
                                <li><strong>Location:</strong> ${det.ReqLoc}</li>
                                <li><strong>Reported At:</strong> ${det.ReqTime}</li>
                            </ul>
                        </div>
                        <div class="action">
                            <button class="btn btn-warning" onclick="markDispatched(this)">Mark Dispatched</button>
                        </div>
                    </div>
                </div>`
    }
}