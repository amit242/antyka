import jsts from 'jsts';

export default class AntykaGeometry {
  constructor() {
    //console.debug('AntykaGeometry constructor');
  }

  /**
 * findSelfIntersects
 *
 * Detect self-intersections in a polygon.
 *
 * @param {object} google.maps.Polygon path co-ordinates.
 * @return {array} array of points of intersections.
 */
  findSelfIntersects(googlePolygonPath) {
    var coordinates = this.googleMaps2JTS(googlePolygonPath);
    var geometryFactory = new jsts.geom.GeometryFactory();
    var shell = geometryFactory.createLinearRing(coordinates);
    var jstsPolygon = geometryFactory.createPolygon(shell);
    console.log('AntykaGeometry.findSelfIntersects()| shell:', shell, jstsPolygon);
    // if the geometry is aleady a simple linear ring, do not
    // try to find self intersection points.
    var validator = new jsts.operation.IsSimpleOp(jstsPolygon);
    //console.log('findSelfIntersects() simple:', validator.isSimple(), validator.isSimpleLinearGeometry(jstsPolygon), jstsPolygon);

    if (validator.isSimpleLinearGeometry(jstsPolygon)) {
      return null;
    }

    var res = [];
    var graph = new jsts.geomgraph.GeometryGraph(0, jstsPolygon);
    var cat = new jsts.operation.valid.ConsistentAreaTester(graph);
    var r = cat.isNodeConsistentArea();
    if (!r) {
      //console.log('findSelfIntersects():', cat);
      var pt = cat.getInvalidPoint();
      res.push([pt.x, pt.y]);
    }
    return res;
  }

  googleMaps2JTS(boundaries) {
    var coordinates = [];

    for (var i = 0; i < boundaries.getLength(); i++) {
      coordinates.push(new jsts.geom.Coordinate(
          boundaries.getAt(i).lat(), boundaries.getAt(i).lng()));
      //console.log('latlang: ', boundaries.getAt(i).lat(), boundaries.getAt(i).lng());
    }
    // adding the first vertex againg to fix intersection bug
    coordinates.push(new jsts.geom.Coordinate(
          boundaries.getAt(0).lat(), boundaries.getAt(0).lng()));
    return coordinates;
  }


  isIntersectingPolygon(googlePolygonPath1, googlePolygonPath2) {
    var geometryFactory = new jsts.geom.GeometryFactory();

    var coordinates1 = this.googleMaps2JTS(googlePolygonPath1);
    var shell1 = geometryFactory.createLinearRing(coordinates1);
    var jstsPolygon1 = geometryFactory.createPolygon(shell1);

    var coordinates2 = this.googleMaps2JTS(googlePolygonPath2);
    var shell2 = geometryFactory.createLinearRing(coordinates2);
    var jstsPolygon2 = geometryFactory.createPolygon(shell2);

    console.log('AntykaGeometry.isIntersectingPolygon()|', jstsPolygon1, jstsPolygon2);
    var intersection = jstsPolygon1.intersection(jstsPolygon2);
    console.debug('AntykaGeometry.isIntersectingPolygon()| intersection:', intersection);
    if(intersection && intersection.geometries && intersection.geometries.length > 0 && intersection.geometries[0].shell) {
      return intersection.geometries[0].shell.points;
    } else if(intersection.shell) {
      return intersection.shell.points;
    }
    return null;
  }
}
