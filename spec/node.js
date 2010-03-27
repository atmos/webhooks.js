require.paths.unshift('spec', '/opt/local/lib/ruby/gems/1.8/gems/jspec-4.1.0/lib', 'lib')
require('jspec')
require('unit/spec.helper')

JSpec
  .exec('spec/unit/spec.js')
  .run({ reporter: JSpec.reporters.Terminal, fixturePath: 'spec/fixtures', failuresOnly: true })
  .report()
