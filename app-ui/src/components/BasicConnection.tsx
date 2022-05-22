import createEngine, {
	DiagramModel,
	DefaultNodeModel,
	DefaultPortModel,
	DefaultLinkFactory,
	DefaultLinkModel,
	DefaultLinkWidget
} from '@projectstorm/react-diagrams';
import { LinkModelListener, LinkWidget, PointModel } from '@projectstorm/react-diagrams-core';
import * as React from 'react';
import '../App.css';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { CustomCanvasWidget } from './CanvasWidget';
import { MouseEvent } from 'react';

let deletedSource, deletedTarget;

export class AdvancedLinkModel extends DefaultLinkModel {
	constructor() {
		super({
			type: 'advanced',
			width: 4
		});
	}
    remove(): void {
        
        if (this.sourcePort) {
            deletedSource = this.sourcePort;
            this.sourcePort.remove();
            this.sourcePort = null;
        }
        if (this.targetPort) {
            deletedTarget = this.targetPort;
            this.targetPort.remove();
            this.targetPort = null;
        }
        super.remove();
            
    }

}

export class AdvancedPortModel extends DefaultPortModel {
	createLinkModel(): AdvancedLinkModel | null {
		return new AdvancedLinkModel();
	}
}

const CustomLinkArrowWidget = (props) => {
	const { point, previousPoint } = props;

	const angle =
		90 +
		(Math.atan2(
			point.getPosition().y - previousPoint.getPosition().y,
			point.getPosition().x - previousPoint.getPosition().x
		) *
			180) /
			Math.PI;

	//translate(50, -10),
	return (
		<g className="arrow" transform={'translate(' + point.getPosition().x + ', ' + point.getPosition().y + ')'}>
			<g style={{ transform: 'rotate(' + angle + 'deg)' }}>
				<g transform={'translate(0, -3)'}>
					<polygon
						points="0,10 8,30 -8,30"
						fill={props.color}
						data-id={point.getID()}
						data-linkid={point.getLink().getID()}
					/>
				</g>
			</g>
		</g>
	);
};

export class AdvancedLinkWidget extends DefaultLinkWidget {
	generateArrow(point: PointModel, previousPoint: PointModel): JSX.Element {
		return (
			<CustomLinkArrowWidget
				key={point.getID()}
				point={point as any}
				previousPoint={previousPoint as any}
				colorSelected={this.props.link.getOptions().selectedColor}
				color={this.props.link.getOptions().color}
			/>
		);
	}



	render() {
		//ensure id is present for all points on the path
		var points = this.props.link.getPoints();
		var paths = [];
		this.refPaths = [];

		//draw the multiple anchors and complex line instead
		for (let j = 0; j < points.length - 1; j++) {
			paths.push(
				this.generateLink(
					LinkWidget.generateLinePath(points[j], points[j + 1]),
					{
						'data-linkid': this.props.link.getID(),
						'data-point': j,
						onMouseDown: (event: MouseEvent) => {
							this.addPointToLink(event, j + 1);
                            console.log('Line Change');
						}
					},
					j
				)
			);
		}

		//render the circles
		for (let i = 1; i < points.length - 1; i++) {
			paths.push(this.generatePoint(points[i]));
		}

		if (this.props.link.getTargetPort() !== null) {
			paths.push(this.generateArrow(points[points.length - 1], points[points.length - 2]));
		} else {
			paths.push(this.generatePoint(points[points.length - 1]));
		}
		return <g className="path" data-default-link-test={this.props.link.getOptions().testName}>{paths}</g>;
	}
}

export class AdvancedLinkFactory extends DefaultLinkFactory {
	constructor() {
		super('advanced');
	}

	generateModel(): AdvancedLinkModel {
		return new AdvancedLinkModel();
	}

	generateReactWidget(event): JSX.Element {
		return <AdvancedLinkWidget link={event.model} diagramEngine={this.engine} />;
	}
}


export default () => {

    function sendMockData(source, target, isConnected) {

        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        }

        if(target === null) {
            requestOptions = {
                ...requestOptions,
                body: JSON.stringify({
                    "components": [
                        {
                            "id": source.id,      
                            "name": source.name, 
                        },
    
                    ],
                    "links": []
                })
            }
        }
        else if(isConnected === true) {
            requestOptions = {
                ...requestOptions,
                body: JSON.stringify({
                    "components": [
                        {
                            "id": source.id,     
                            "name": source.name, 
                        },
                        {
                            "id": target.id,      
                            "name": target.name, 
                        }
    
                    ],
                    "links": [
                        {
                            "src": source.id,
                            "dest": target.id
                        }
                    ]
                })
            }
        } else {
            requestOptions = {
                ...requestOptions,
                body: JSON.stringify({
                    "components": [
                        {
                            "id": source.id,      
                            "name": source.name, 
                        },
                        {
                            "id": target.id,      
                            "name": target.name, 
                        }
    
                    ],
                    "links": []
                })
            }
        }

        fetch('/api/state/cache', requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
    }


	var engine = createEngine();
	engine.getLinkFactories().registerFactory(new AdvancedLinkFactory());




	var node1 = new DefaultNodeModel('Source 1', 'rgb(255, 25, 0)');
	let port1 = node1.addPort(new AdvancedPortModel(false, 'out'));
	node1.setPosition(100, 100);

	var node2 = new DefaultNodeModel('Target 1', 'rgb(255, 221, 0)');
	var port2 = node2.addPort(new AdvancedPortModel(true, 'in'));
	node2.setPosition(500, 350);

	var node3 = new DefaultNodeModel('Source 2', 'rgb(0,192,255)');
	let port3 = node3.addPort(new AdvancedPortModel(false, 'out'));
	node3.setPosition(100, 500);

	var node4 = new DefaultNodeModel('Target 2', 'rgb(192,255,0)');
	var port4 = node4.addPort(new AdvancedPortModel(true, 'in'));
	node4.setPosition(500, 450);

	var model = new DiagramModel();

	model.addAll(port1.link(port2));

	// add everything else
	model.addAll(node1, node2, node3, node4);

    model.registerListener({
        linksUpdated: (event) => {
            if(event.firing === true && event.isCreated === true ) { 
                const source: any = event.link.getSourcePort().getNode().getOptions();
                // const target: any = event.link.getTargetPort().getParent().getOptions();
                sendMockData(source, null, true);
                
            }
            if(event.isCreated === false ) {
                const source: any = deletedSource.getNode().getOptions();
                const target: any = deletedTarget.getNode().getOptions();
                sendMockData(source, target, false);
            }
            event.link.registerListener({
                targetPortChanged: (event) => {
                    const source: any = event.entity.getSourcePort().getNode().getOptions();
                    const target: any = event.entity.getTargetPort().getNode().getOptions();
                    sendMockData(source, target, true);
               }
           })
        }
    });

    

	// load model into engine
	engine.setModel(model);

	// render the diagram!
	return (
		<CustomCanvasWidget>
			<CanvasWidget engine={engine} />
		</CustomCanvasWidget>
	);
};

