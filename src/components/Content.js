import React from 'react';
import Section from './Section.js';
import withRouter from 'react-router-dom/withRouter';

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: this.props.filters,
            categoryFilters: this.props.categoryFilters,
            partners: {},
            categories: {},
            showModal: false
        };
        this.sortKeys = this.sortKeys.bind(this);
    }

    //Updates data after asynchronous data load
    componentWillReceiveProps(nextProps){
        this.setState(nextProps);
    }

    //Sorts the category keys
    sortKeys(categories)
    {
        var keysSorted;
        if(this.props.filters.indexOf(window.App.stringConstants.alphabetically)!==-1)
        {
            keysSorted  = Object.keys(categories).sort(function(a,b)
            {
                return (categories[a].name < categories[b].name) ? -1 : (categories[a].name > categories[b].name) ? 1 : 0;
            });
        }
        return keysSorted;
    }

    //Create the categories which in turn will have the details of partners in
    //that particular category
    createSections(event){
        var self = this;
        let categories = this.state.categories;
        let partners = this.state.partners;
        let sections = [];
        var keysSorted;
        if(this.props.categoryFilters.length > 0)
        {
            categories = categories.filter(function(category){
                if(self.props.categoryFilters.indexOf(category.id)>-1)
                {
                    return true;
                }
            });
        }
        if(this.props.filters.length > 0)
        {
            keysSorted = this.sortKeys(categories);
        }
        else
        {
            keysSorted = Object.keys(categories);
        }
        for (let i = 0; i < categories.length; i++) {
            var filtered = [];
            for (let j = 0; j < partners.length; j++) {
                partners[j].categories.forEach(category => {
                    if(parseInt(category.category_id,10) === categories[keysSorted[i]].id)
                    {
                        filtered.push(partners[j]);
                    }
                });
            }
            let sectionId = 'section-'+i;
            //creating the sections for different types of partners
            sections.push(<Section key={categories[keysSorted[i]].id} id={sectionId} data={filtered} type={categories[keysSorted[i]].name}/>);
        }
        return sections;
    }

    render() {
      return (
        <div>{this.createSections()}</div>
      );
    }
}
export default withRouter(Content);