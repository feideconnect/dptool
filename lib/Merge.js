
"use strict";

class Merge {
  constructor(api, to, from) {

    this.orgs = {}
    this.services = []

    this.api = api
    this.to = to
    this.from = from
  }

  fetchServices() {

  }

  fetchOrg(org) {
    return this.api.get('get', this.api.getURL({
  		"component": "core",
  		"path": "/orgs/fc:org:" + org
  	}))
      .then((orgdata) => {
        this.orgs[org] = orgdata
      })
  }

  init() {

      let orgs = this.from.slice(0)
      orgs.push(this.to)

      return Promise.all(orgs.map((org) => {
        return this.fetchOrg(org)
      }))
        .then((data) => {
          console.log(' ----- ')
          console.log(this.orgs)
        })

  }

}

module.exports.Merge = Merge
// export Merge
