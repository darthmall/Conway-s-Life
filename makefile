PROJECTNAME = conways
BUILDDIR = build
DISTDIR = dist
CSSDIR = css
JSDIR = js
BINDIR = bin
COMPRESSOR = $(BINDIR)/yuicompressor-2.4.2.jar

build:
	mkdir $(BUILDDIR)
	cp -r $(CSSDIR) $(BUILDDIR)/$(CSSDIR)
	cp -r $(JSDIR) $(BUILDDIR)/$(JSDIR)
	cp life.html $(BUILDDIR)
	java -jar $(COMPRESSOR) --type css -o conway.css $(BUILDDIR)/$(CSSDIR)/conway.css
	java -jar $(COMPRESSOR) --type css -o reset.css $(BUILDDIR)/$(CSSDIR)/reset.css
	java -jar $(COMPRESSOR) --type js -o conway.js $(BUILDDIR)/$(JSDIR)/conway.js
	mv conway.css $(BUILDDIR)/$(CSSDIR)/conway.css
	mv reset.css $(BUILDDIR)/$(CSSDIR)/reset.css
	mv conway.js $(BUILDDIR)/$(JSDIR)/conway.js

dist: build
	mkdir $(DISTDIR)
	tar -cjf $(DISTDIR)/$(PROJECTNAME).tar.bz2 -s /$(BUILDDIR)/$(PROJECTNAME)/ $(BUILDDIR)

clean:
	rm -rf $(BUILDDIR)
	rm -rf $(DISTDIR)
