import React from "react";
import classNames from "classnames";
import { CoverageSummary, Totals } from "istanbul-lib-coverage";

import { Document } from "./document";
import { Styles } from "./styles";
import { Link } from "../contracts";
import { getClassNameByPercentage } from "./helpers";

function RenderCoverage(props: { name: string; coverage: Totals }): JSX.Element {
    return (
        <div className="item">
            <span className="pct">{props.coverage.pct}%</span>
            <span className="name">{props.name}</span>
            <span className="label grey">
                {props.coverage.covered}/{props.coverage.total}
            </span>
        </div>
    );
}

function BreadCrumbs(props: { breadcrumbs: Link[] }): JSX.Element {
    let links: JSX.Element[] | JSX.Element;
    if (props.breadcrumbs.length > 0) {
        links = props.breadcrumbs
            .map(breadcrumb => {
                if (breadcrumb.url != null) {
                    return (
                        <a key={`link-${breadcrumb.url}`} href={breadcrumb.url}>
                            {breadcrumb.name}
                        </a>
                    );
                } else {
                    return <span key={`link-${breadcrumb.url}`}>{breadcrumb.name}</span>;
                }
            })
            .reduce<JSX.Element[]>((arr, item, currentIndex) => {
                if (currentIndex != props.breadcrumbs.length - 1) {
                    return arr.concat(
                        item,
                        <span key={`sep-${currentIndex}`} className="sep">
                            /
                        </span>
                    );
                } else {
                    return arr.concat(item);
                }
            }, []);
    } else {
        links = <span key="root">All files</span>;
    }

    return <h4 className="breadcrumbs">{links}</h4>;
}

interface Props {
    datetime: string;
    title: string;
    breadcrumbs: Link[];
    children: React.ReactNode;
    coverage: CoverageSummary;
}

export function Layout(props: Props): JSX.Element {
    return (
        <Document title={props.title}>
            <Styles src="./layout.css" />
            <div className="layout">
                <div className="header">
                    <BreadCrumbs breadcrumbs={props.breadcrumbs} />
                    <div className="overall-coverage">
                        <RenderCoverage name="Statements" coverage={props.coverage.statements} />
                        <RenderCoverage name="Branches" coverage={props.coverage.branches} />
                        <RenderCoverage name="Functions" coverage={props.coverage.functions} />
                        <RenderCoverage name="Lines" coverage={props.coverage.lines} />
                    </div>
                </div>
                <div className={classNames("coverage-line", getClassNameByPercentage(props.coverage.statements.pct))} />
                <div className="content">{props.children}</div>
                <div className="footer">
                    Code coverage generated by{" "}
                    <a href="https://istanbul.js.org/" target="_blank">
                        istanbul
                    </a>{" "}
                    at {props.datetime}.
                </div>
            </div>
        </Document>
    );
}
