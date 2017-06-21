import {TSMap} from "typescript-map";
export class Templates {
    static mainResults(results: TSMap<string,string>) {
        return '<div>'
            + results.map((key,value) => '<div>' + key + '' + value + '</div>').join() +
            '</div>';
    }

}
